<script setup lang="ts">
import { computed } from 'vue'
import { useEmojiStore } from '@/store/emoji'
import { useAppStore } from '@/store/app'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import EmojiItem from '@/views/components/EmojiItem.vue'

const appStore = useAppStore()
const emojiStore = useEmojiStore()

const historyItems = computed(() => emojiStore.getEmojiHistory)

const historyData = computed(() => {
    let historyHexCodes = historyItems.value.map(item => item.hexcode)
    return emojiStore.emojiData.filter((item: any) => {
        return historyHexCodes.includes(item.hexcode)
    })
})

const gotoBase = () => {
    appStore.handleMenuSelect('base')
}

</script>

<template>
    <div class="w-full h-full">
        <Empty class="w-full h-full" v-if="historyItems.length === 0">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <!-- <FolderOpen /> -->
                </EmptyMedia>
            </EmptyHeader>
            <EmptyTitle>这里空空如也</EmptyTitle>
            <EmptyDescription>你每复制一次我就当你使用过一次了哈</EmptyDescription>
            <EmptyContent>
                <Button class="cursor-pointer" @click="gotoBase">去看看</Button>
            </EmptyContent>
        </Empty>
        <template v-else>
            <div class="w-full flex justify-start items-center mb-(--margin-l)">
                <Input class="w-[400px]" placeholder="请输入关键字进行搜索" />
            </div>
            <div class="w-full grid grid-cols-10 gap-(--margin-s)">
                <div v-for="emoji in historyData" :key="emoji.key"> 
                    <EmojiItem :data="emoji" />
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped lang="scss"></style>
