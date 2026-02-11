<script setup lang="ts">
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { useEmojiStore } from '@/store/index'
import { onMounted, ref } from 'vue'
import EmojiItem from '@/views/components/EmojiItem.vue'

const emojiStore = useEmojiStore()

const data = ref<any>([])

const initData = async () => {
    const groups = JSON.parse(JSON.stringify(emojiStore.emojiGroupData))
    const value = emojiStore.emojiData
    // console.log(value);
    let list: any = []
    groups.forEach((item: any, groupIndex: number) => {
        list.push({
            key: item.key,
            name: item.message,
            children: value.filter((emoji: any) => emoji.group === groupIndex)
        })
    })
    console.log(list);
    data.value = [list[0]]
}

onMounted(() => {
    initData()
})

</script>

<template>
    <div class="h-full w-full flex flex-col justify-center items-center gap-y-(--margin-xl)">
        <!-- <div class="w-full p-(--padding-m)" v-for="item in data" :key="item.key">
            <div class="app_page_title w-full font-bold text-2xl">{{ item.name }}</div>
            <div
                class="w-full mt-(--margin-s) p-(--padding-s) flex justify-center items-center gap-(--margin-s) border">
                <div v-for="emoji in item.children" :key="emoji.key">{{ emoji.unicode }}</div>
            </div>
        </div> -->
        <Card class="w-full" v-for="item in data" :key="item.key">
            <CardHeader>
                <CardTitle class="app_page_title w-full font-bold text-2xl">{{ item.name }}</CardTitle>
                <CardDescription>description</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="w-full grid grid-cols-12 p-(--padding-s) gap-(--margin-s) border">
                    <div v-for="emoji in item.children" :key="emoji.key">
                        <EmojiItem :data="emoji" />
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<style scoped lang="scss"></style>
