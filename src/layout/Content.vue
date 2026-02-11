<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import { useEmojiStore, useAppStore } from '@/store/index'
import { onMounted } from 'vue'

const emojiStore = useEmojiStore()
const appStore = useAppStore()

onMounted(() => {
    emojiStore.getEmojiData()
})

</script>

<template>
    <div class="overflow-hidden w-full flex-1 p-(--padding-l) box-border">
        <div class="h-full w-full flex justify-center items-center" v-if="emojiStore.loading">
            <Spinner class="size-6" />
            正在加载中
        </div>
        <ScrollArea class="content_scroll_area h-full w-full p-4" v-else asChild>
            <component :is="appStore.currentMenuComponent" />
        </ScrollArea>
    </div>
</template>

<style scoped lang="scss">
.content_scroll_area {}
</style>
