<script setup lang="ts">
import { computed, ref } from 'vue'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import EmojiItem from '@/views/components/EmojiItem.vue'

const appStore = useAppStore()
const emojiStore = useEmojiStore()

const historyItems = computed(() => emojiStore.getEmojiHistory)

const historyData = computed(() => {
    let historyHexCodes = historyItems.value.map(item => item.hexcode)
    let list = emojiStore.emojiData.filter((item: any) => {
        return historyHexCodes.includes(item.hexcode)
    })
    if (searchWord.value && searchWord.value.length > 0) {
        list = list.filter((item: any) => {
            return item.label.includes(searchWord.value) || item.tags.includes(searchWord.value) || item.unicode.includes(searchWord.value)
        })
    }
    return list
})

const search = ref('')

const clearSearch = () => {
    search.value = ''
}

const searchWord = computed(() => {
    return search.value.trim()
})

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
                <Button class="cursor-pointer" @click="appStore.handleMenuSelect('base')">去看看</Button>
            </EmptyContent>
        </Empty>
        <template v-else>
            <div class="w-full flex justify-between items-center mb-(--margin-l)">
                <div class="flex items-center gap-(--margin-xs)">
                    <Input v-model="search" class="w-[400px]" placeholder="请输入关键字进行搜索" />
                    <Button class="cursor-pointer" variant="secondary" @click="clearSearch">
                        ❌️
                    </Button>
                </div>
                <div class="flex items-center gap-(--margin-l)">
                    <div class="flex items-center gap-(--margin-xs)">
                        <SelectLabel>历史记录存留个数</SelectLabel>
                        <Select v-model="emojiStore.historySize">
                            <SelectTrigger class="w-[100px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem :value="item.value" v-for="item in emojiStore.historySizeOptions"
                                    :key="item.value">
                                    {{ item.label }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button class="cursor-pointer" variant="destructive" @click="emojiStore.clearEmojiHistory">
                        一键清空
                    </Button>
                </div>
            </div>
            <div class="w-full grid grid-cols-10 gap-(--margin-s)">
                <div v-for="emoji in historyData" :key="emoji.key">
                    <EmojiItem :data="emoji" :highlight="searchWord" />
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped lang="scss"></style>
