<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEmojiStore } from '@/store/emoji'
import { Button } from '@/components/ui/button'
import EmojiItem from '@/views/components/EmojiItem.vue'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '@/components/ui/number-field'
import { toast } from 'vue-sonner'

const emojiStore = useEmojiStore()
const totalNum = computed(() => emojiStore.emojiData.length)

// 获取单个随机索引
const getRandomIndex = () => Math.floor(Math.random() * totalNum.value)

// 当前生成的 emoji 列表
const randomEmojis = ref<any[]>([])

// 用户选择的生成数量
const count = ref(8)

// 生成多个随机 emoji
const generateRandomEmojis = () => {
    randomEmojis.value = Array.from({ length: count.value }, () => {
        const index = getRandomIndex()
        return emojiStore.emojiData[index]
    })
    toast.success(`成功生成 ${count.value} 个随机表情`)
}

// 初始化一次
generateRandomEmojis()
</script>

<template>
    <div class="w-full h-full flex flex-col gap-y-(--margin-l)">
        <div class="flex items-end">
            <NumberField class="w-[200px]" :min="1" v-model="count">
                <Label>生成个数</Label>
                <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                </NumberFieldContent>
            </NumberField>
            <Button class="cursor-pointer ml-(--margin-l)" @click="generateRandomEmojis">
                🎲 随机生成 {{ count }} 个
            </Button>
        </div>
        <div class="w-full flex-1">
            <ScrollArea class="w-full h-full">
                <div class="w-full grid grid-cols-8 gap-(--margin-s)">
                    <EmojiItem v-for="(emoji, idx) in randomEmojis" :key="idx" :data="emoji" />
                </div>
            </ScrollArea>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>