<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { useEmojiStore } from '@/store/index'
import { onMounted, onUnmounted, ref, nextTick, computed } from 'vue'
import EmojiItem from '@/views/components/EmojiItem.vue'

const EMOJI_GROUP_ID_PREFIX = 'emoji-group-'

const emojiStore = useEmojiStore()

const data = ref<any>([])

const groups = computed(() => {
    let list = JSON.parse(JSON.stringify(emojiStore.emojiGroupData))
    return list.slice(0, 1)
})

const initData = async () => {
    if (groups.value.length > 0) {
        groupIndex.value = groups.value[0].key
    }
    const value = emojiStore.emojiData
    // console.log(value);
    let list: any = []
    groups.value.forEach((item: any, groupIndex: number) => {
        list.push({
            key: item.key,
            name: item.message,
            children: value.filter((emoji: any) => emoji.group === groupIndex)
        })
    })
    console.log(list);
    data.value = list
}

let observer: IntersectionObserver | null = null
const groupIndex = ref<string | undefined>(undefined)

const scrollToGroup = (key: string) => {
    const el = document.getElementById(`${EMOJI_GROUP_ID_PREFIX}${key}`)
    if (!el) {
        return false;
    }
    if (observer) {
        observer.disconnect()
    }
    el.scrollIntoView({ behavior: 'instant', block: 'start' })
    groupIndex.value = key
    setTimeout(() => {
        observeAll()
    }, 1000)
}

// 自定义方法：批量 observe 所有分组
function observeAll() {
    emojiStore.emojiGroupData.forEach((item: any) => {
        const el = document.getElementById(`${EMOJI_GROUP_ID_PREFIX}${item.key}`)
        if (el) observer?.observe(el)
    })
}

onMounted(() => {
    initData()
    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const key = entry.target.id.replace(EMOJI_GROUP_ID_PREFIX, '')
                if (entry.isIntersecting) {
                    groupIndex.value = key
                }
            })
        },
        {
            // 关键：监听元素顶部进入视口顶部 0~100px 的区域
            rootMargin: '-20% 0% -80% 0%', // 调整灵敏度
            threshold: 0
        }
    )
    // 等 DOM 渲染后再 observe
    nextTick(() => {
        observeAll()
    })
})

onUnmounted(() => {
    observer?.disconnect()
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
                        <TabsTrigger class="w-full" :value="group.key" v-for="group in groups"
                            :key="group.key" @click="scrollToGroup(group.key)">
                            {{ group.message }}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardContent>
        </Card>
        <div class="h-full flex-1">
            <ScrollArea class="w-full h-full">
                <Card :class="`${index === data.length - 1 ? 'mt-0' : 'mb-(--margin-xl)'}`"
                    v-for="(item, index) in data" :key="item.key" :id="`${EMOJI_GROUP_ID_PREFIX}${item.key}`">
                    <CardHeader>
                        <CardTitle class="app_page_title w-full font-bold text-2xl">{{ item.name }}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="w-full grid grid-cols-10 gap-(--margin-s)">
                            <div v-for="emoji in item.children" :key="emoji.key">
                                <EmojiItem :data="emoji" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ScrollArea>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
