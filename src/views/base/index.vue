<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useEmojiStore } from '@/store/index'
import EmojiItem from '@/views/components/EmojiItem.vue'

const EMOJI_GROUP_ID_PREFIX = 'emoji-group-'
const EMOJI_COLUMNS = 10
const GROUP_OVERSCAN_PX = 600
const GROUP_ACTIVE_OFFSET_PX = 120
const GRID_GAP_PX = 12
const EMOJI_ITEM_ESTIMATED_HEIGHT = 186
const SEARCH_ROW_OVERSCAN = 4
const SEARCH_DEBOUNCE_MS = 500
const NAVIGATION_SYNC_LOCK_MS = 400

type EmojiRecord = {
  key: string | number
  group?: number
  label?: string
  tags?: string[]
  unicode?: string
  [key: string]: unknown
}

type EmojiGroupRecord = {
  key: string
  message: string
}

type EmojiSection = {
  key: string
  name: string
  children: EmojiRecord[]
  estimatedGridHeight: number
}

type SearchRow = {
  key: string
  rowIndex: number
  top: number
  items: EmojiRecord[]
}

type TemplateRefValue = Element | ComponentPublicInstance | null

const emojiStore = useEmojiStore()

const search = shallowRef('')
const debouncedSearch = shallowRef('')
const groupIndex = shallowRef<string | undefined>(undefined)
const scrollTop = shallowRef(0)
const viewportHeight = shallowRef(0)
const searchRowHeight = shallowRef(EMOJI_ITEM_ESTIMATED_HEIGHT)

const scrollAreaRef = ref<HTMLElement | null>(null)
const scrollViewportEl = shallowRef<HTMLElement | null>(null)
const renderedGroupKeyMap = ref<Record<string, true>>({})
const measuredGroupGridHeights = ref<Record<string, number>>({})

const groupCardRefs = new Map<string, HTMLElement>()
const groupGridRefs = new Map<string, HTMLElement>()

let viewportSyncFrame: number | null = null
let manualSyncLockTimer: ReturnType<typeof window.setTimeout> | null = null
let manualSyncLockUntil = 0
let groupGridResizeObserver: ResizeObserver | null = null
let searchRowResizeObserver: ResizeObserver | null = null
let observedSearchRowEl: HTMLElement | null = null

const emojiList = computed<EmojiRecord[]>(() => emojiStore.emojiData ?? [])
const groups = computed<EmojiGroupRecord[]>(() => emojiStore.emojiGroupData ?? [])

const estimateGridHeight = (count: number) => {
  if (count <= 0) {
    return 0
  }

  const rows = Math.ceil(count / EMOJI_COLUMNS)
  return rows * EMOJI_ITEM_ESTIMATED_HEIGHT + Math.max(0, rows - 1) * GRID_GAP_PX
}

const groupedEmojiMap = computed(() => {
  const map = new Map<number, EmojiRecord[]>()

  for (const emoji of emojiList.value) {
    const group = typeof emoji.group === 'number' ? emoji.group : -1
    const groupEmojis = map.get(group)

    if (groupEmojis) {
      groupEmojis.push(emoji)
      continue
    }

    map.set(group, [emoji])
  }

  return map
})

const data = computed<EmojiSection[]>(() =>
  groups.value.map((group, groupOrder) => {
    const children = groupedEmojiMap.value.get(groupOrder) ?? []

    return {
      key: String(group.key),
      name: group.message,
      children,
      estimatedGridHeight: estimateGridHeight(children.length),
    }
  }),
)

watch(
  search,
  (value, _oldValue, onCleanup) => {
    const keyword = value.trim()

    if (!keyword) {
      debouncedSearch.value = ''
      return
    }

    const timer = window.setTimeout(() => {
      debouncedSearch.value = value
    }, SEARCH_DEBOUNCE_MS)

    onCleanup(() => {
      window.clearTimeout(timer)
    })
  },
  { flush: 'post' },
)

const searchData = computed<EmojiRecord[]>(() => {
  const keyword = debouncedSearch.value.trim()

  if (!keyword) {
    return []
  }

  return emojiList.value.filter((item) => {
    return (
      (!!item.label && item.label.includes(keyword)) ||
      (!!item.tags && item.tags.includes(keyword)) ||
      (!!item.unicode && item.unicode.includes(keyword))
    )
  })
})

const showSearchResults = computed(() => {
  return debouncedSearch.value.trim().length > 0 && searchData.value.length > 0
})

const searchRows = computed<EmojiRecord[][]>(() => {
  if (!showSearchResults.value) {
    return []
  }

  const rows: EmojiRecord[][] = []

  for (let index = 0; index < searchData.value.length; index += EMOJI_COLUMNS) {
    rows.push(searchData.value.slice(index, index + EMOJI_COLUMNS))
  }

  return rows
})

const searchRowSize = computed(() => searchRowHeight.value + GRID_GAP_PX)

const searchVisibleWindow = computed(() => {
  const totalRows = searchRows.value.length

  if (!totalRows) {
    return {
      start: 0,
      end: 0,
    }
  }

  const start = Math.max(0, Math.floor(scrollTop.value / searchRowSize.value) - SEARCH_ROW_OVERSCAN)
  const end = Math.min(
    totalRows,
    Math.ceil((scrollTop.value + viewportHeight.value) / searchRowSize.value) + SEARCH_ROW_OVERSCAN,
  )

  return { start, end }
})

const visibleSearchRows = computed<SearchRow[]>(() => {
  const { start, end } = searchVisibleWindow.value

  return searchRows.value.slice(start, end).map((items, index) => {
    const rowIndex = start + index

    return {
      key: `search-row-${rowIndex}`,
      rowIndex,
      top: rowIndex * searchRowSize.value,
      items,
    }
  })
})

const searchTotalHeight = computed(() => {
  const totalRows = searchRows.value.length

  if (!totalRows) {
    return 0
  }

  return totalRows * searchRowHeight.value + Math.max(0, totalRows - 1) * GRID_GAP_PX
})

const hasSameRenderedGroups = (current: Record<string, true>, next: Record<string, true>) => {
  const currentKeys = Object.keys(current)
  const nextKeys = Object.keys(next)

  if (currentKeys.length !== nextKeys.length) {
    return false
  }

  return currentKeys.every((key) => next[key] === true)
}

const getElementFromTemplateRef = (value: TemplateRefValue) => {
  if (!value) {
    return null
  }

  if (value instanceof Element) {
    return value as HTMLElement
  }

  return value.$el instanceof HTMLElement ? value.$el : null
}

const updateGroupedViewportState = () => {
  if (!data.value.length) {
    renderedGroupKeyMap.value = {}
    return
  }

  const minVisibleTop = scrollTop.value - GROUP_OVERSCAN_PX
  const maxVisibleBottom = scrollTop.value + viewportHeight.value + GROUP_OVERSCAN_PX
  const nextRenderedGroups: Record<string, true> = {}
  const firstGroup = data.value[0]
  let nextGroupIndex = firstGroup?.key

  if (!nextGroupIndex) {
    return
  }

  for (const [index, section] of data.value.entries()) {
    const groupCardEl = groupCardRefs.get(section.key)

    if (!groupCardEl) {
      if (index < 2) {
        nextRenderedGroups[section.key] = true
      }
      continue
    }

    const top = groupCardEl.offsetTop
    const bottom = top + groupCardEl.offsetHeight

    if (bottom >= minVisibleTop && top <= maxVisibleBottom) {
      nextRenderedGroups[section.key] = true
    }

    if (top <= scrollTop.value + GROUP_ACTIVE_OFFSET_PX) {
      nextGroupIndex = section.key
    }
  }

  if (groupIndex.value) {
    nextRenderedGroups[groupIndex.value] = true
  }

  if (!hasSameRenderedGroups(renderedGroupKeyMap.value, nextRenderedGroups)) {
    renderedGroupKeyMap.value = nextRenderedGroups
  }

  if (Date.now() >= manualSyncLockUntil && groupIndex.value !== nextGroupIndex) {
    groupIndex.value = nextGroupIndex
  }
}

const syncViewportState = () => {
  const viewport = scrollViewportEl.value

  if (!viewport) {
    return
  }

  scrollTop.value = viewport.scrollTop
  viewportHeight.value = viewport.clientHeight

  if (!showSearchResults.value) {
    updateGroupedViewportState()
  }
}

const scheduleViewportSync = () => {
  if (viewportSyncFrame !== null) {
    return
  }

  viewportSyncFrame = window.requestAnimationFrame(() => {
    viewportSyncFrame = null
    syncViewportState()
  })
}

const bindScrollViewport = () => {
  const nextViewport = scrollAreaRef.value?.querySelector(
    '[data-slot="scroll-area-viewport"]',
  ) as HTMLElement | null

  if (scrollViewportEl.value === nextViewport) {
    return
  }

  if (scrollViewportEl.value) {
    scrollViewportEl.value.removeEventListener('scroll', scheduleViewportSync)
  }

  scrollViewportEl.value = nextViewport
  scrollViewportEl.value?.addEventListener('scroll', scheduleViewportSync, { passive: true })
}

const setGroupCardRef = (key: string, element: TemplateRefValue) => {
  const groupCardEl = getElementFromTemplateRef(element)

  if (groupCardEl) {
    groupCardRefs.set(key, groupCardEl)
  } else {
    groupCardRefs.delete(key)
  }

  scheduleViewportSync()
}

const setGroupGridRef = (key: string, element: TemplateRefValue) => {
  const groupGridEl = getElementFromTemplateRef(element)
  const previousGridEl = groupGridRefs.get(key)

  if (previousGridEl && previousGridEl !== groupGridEl) {
    groupGridResizeObserver?.unobserve(previousGridEl)
    groupGridRefs.delete(key)
  }

  if (!groupGridEl) {
    return
  }

  groupGridEl.dataset.groupKey = key
  groupGridRefs.set(key, groupGridEl)
  groupGridResizeObserver?.observe(groupGridEl)
}

const setSearchRowRef = (element: TemplateRefValue) => {
  const searchRowEl = getElementFromTemplateRef(element)

  if (observedSearchRowEl && observedSearchRowEl !== searchRowEl) {
    searchRowResizeObserver?.unobserve(observedSearchRowEl)
  }

  observedSearchRowEl = searchRowEl

  if (searchRowEl) {
    searchRowResizeObserver?.observe(searchRowEl)
  }
}

const shouldRenderGroup = (key: string, index: number) => {
  if (showSearchResults.value) {
    return false
  }

  return index < 2 || renderedGroupKeyMap.value[key] === true || groupIndex.value === key
}

const getGroupPlaceholderHeight = (section: EmojiSection) => {
  return measuredGroupGridHeights.value[section.key] ?? section.estimatedGridHeight
}

const scrollToGroup = (key: string) => {
  if (showSearchResults.value) {
    return false
  }

  const viewport = scrollViewportEl.value
  const groupCardEl = groupCardRefs.get(key)

  if (!viewport || !groupCardEl) {
    return false
  }

  manualSyncLockUntil = Date.now() + NAVIGATION_SYNC_LOCK_MS
  groupIndex.value = key
  renderedGroupKeyMap.value = {
    ...renderedGroupKeyMap.value,
    [key]: true,
  }

  viewport.scrollTo({
    top: groupCardEl.offsetTop,
    behavior: 'auto',
  })

  if (manualSyncLockTimer) {
    window.clearTimeout(manualSyncLockTimer)
  }

  manualSyncLockTimer = window.setTimeout(() => {
    manualSyncLockUntil = 0
    scheduleViewportSync()
  }, NAVIGATION_SYNC_LOCK_MS)

  return true
}

watch(
  data,
  async (sections) => {
    if (!sections.length) {
      groupIndex.value = undefined
      return
    }

    const firstGroup = sections[0]

    if (!firstGroup) {
      return
    }

    if (!groupIndex.value || !sections.some((section) => section.key === groupIndex.value)) {
      groupIndex.value = firstGroup.key
    }

    await nextTick()
    bindScrollViewport()
    scheduleViewportSync()
  },
  { immediate: true },
)

watch(
  showSearchResults,
  async () => {
    await nextTick()
    bindScrollViewport()
    scheduleViewportSync()
  },
  { flush: 'post' },
)

watch(searchRows, async () => {
  await nextTick()
  scheduleViewportSync()
})

onMounted(async () => {
  groupGridResizeObserver = new ResizeObserver((entries) => {
    const nextHeights = { ...measuredGroupGridHeights.value }
    let hasChanged = false

    for (const entry of entries) {
      const key = (entry.target as HTMLElement).dataset.groupKey

      if (!key) {
        continue
      }

      const nextHeight = Math.ceil(entry.contentRect.height)

      if (nextHeights[key] !== nextHeight) {
        nextHeights[key] = nextHeight
        hasChanged = true
      }
    }

    if (hasChanged) {
      measuredGroupGridHeights.value = nextHeights
      scheduleViewportSync()
    }
  })

  searchRowResizeObserver = new ResizeObserver((entries) => {
    const nextHeight = Math.ceil(entries[0]?.contentRect.height ?? 0)

    if (nextHeight > 0 && searchRowHeight.value !== nextHeight) {
      searchRowHeight.value = nextHeight
    }
  })

  for (const [key, groupGridEl] of groupGridRefs.entries()) {
    groupGridEl.dataset.groupKey = key
    groupGridResizeObserver.observe(groupGridEl)
  }

  if (observedSearchRowEl) {
    searchRowResizeObserver.observe(observedSearchRowEl)
  }

  await nextTick()
  bindScrollViewport()
  scheduleViewportSync()
  window.addEventListener('resize', scheduleViewportSync, { passive: true })
})

onUnmounted(() => {
  if (viewportSyncFrame !== null) {
    window.cancelAnimationFrame(viewportSyncFrame)
  }

  if (manualSyncLockTimer) {
    window.clearTimeout(manualSyncLockTimer)
  }

  if (scrollViewportEl.value) {
    scrollViewportEl.value.removeEventListener('scroll', scheduleViewportSync)
  }

  window.removeEventListener('resize', scheduleViewportSync)
  groupGridResizeObserver?.disconnect()
  searchRowResizeObserver?.disconnect()
})
</script>

<template>
  <div class="h-full w-full flex justify-between items-center gap-x-(--margin-l)">
    <Card class="h-full w-[150px]">
      <CardHeader>
        <CardTitle class="app_page_title font-bold text-lg">快捷导航</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs v-model="groupIndex" orientation="vertical" data-orientation="vertical">
          <TabsList class="flex-col flex w-full h-fit gap-y-(--margin-xxs)">
            <TabsTrigger
              v-for="group in groups"
              :key="group.key"
              class="w-full"
              :value="group.key"
              @click="scrollToGroup(group.key)"
            >
              {{ group.message }}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
    <div class="flex-1 h-full flex flex-col gap-y-(--margin-l) overflow-hidden">
      <div class="flex items-center gap-(--margin-xs)">
        <Input v-model="search" class="w-[400px]" placeholder="请输入关键字进行搜索" />
      </div>
      <div ref="scrollAreaRef" class="w-full flex-1 overflow-hidden">
        <ScrollArea class="w-full h-full" id="scrollAreaEl">
          <template v-if="!showSearchResults">
            <template v-for="(item, index) in data" :key="item.key">
              <Card
                :id="`${EMOJI_GROUP_ID_PREFIX}${item.key}`"
                :class="index === data.length - 1 ? 'mt-0' : 'mb-(--margin-xl)'"
                :ref="(element) => setGroupCardRef(item.key, element)"
              >
                <CardHeader>
                  <CardTitle class="app_page_title w-full font-bold text-2xl">
                    {{ item.name }}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    v-if="shouldRenderGroup(item.key, index)"
                    :ref="(element) => setGroupGridRef(item.key, element)"
                    class="w-full grid grid-cols-10 gap-(--margin-s)"
                  >
                    <div v-for="emoji in item.children" :key="emoji.key">
                      <EmojiItem :data="emoji" />
                    </div>
                  </div>
                  <div
                    v-else
                    aria-hidden="true"
                    class="w-full"
                    :style="{ height: `${getGroupPlaceholderHeight(item)}px` }"
                  />
                </CardContent>
              </Card>
            </template>
          </template>
          <template v-else>
            <div class="relative w-full" :style="{ height: `${searchTotalHeight}px` }">
              <div
                v-for="row in visibleSearchRows"
                :key="row.key"
                :ref="setSearchRowRef"
                class="absolute left-0 w-full"
                :style="{ top: `${row.top}px` }"
              >
                <div class="w-full grid grid-cols-10 gap-(--margin-s)">
                  <div v-for="emoji in row.items" :key="emoji.key">
                    <EmojiItem :data="emoji" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </ScrollArea>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
