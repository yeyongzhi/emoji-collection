<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Item,
    ItemActions,
    ItemContent,
    ItemMedia,
    ItemDescription,
    ItemTitle,
} from '@/components/ui/item'
import KnowImg from '@/assets/images/know.jpg'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

const data = ref<any>([])
const title = ref('版本更新日志')

onMounted(() => {
    fetch('./version.json')
        .then(res => res.json())
        .then(result => {
            console.log(result)
            title.value = result.name
            data.value = result.data
        })
})

</script>

<template>
    <div class="w-full h-full">
        <ScrollArea class="w-[50%] h-full">
            <Item variant="muted" class="mb-(--margin-l)">
                <ItemContent>
                    <ItemTitle class="text-xl font-bold">{{ title }}</ItemTitle>
                    <ItemDescription>
                        写一下这个显得我很专业
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                    <img :src="KnowImg" alt="know" class="w-[100px] h-[100px]" />
                </ItemActions>
            </Item>
            <Item variant="muted" class="mb-(--margin-l)" v-for="item in data" :key="item.version">
                <ItemMedia variant="icon" class="w-[50px] h-[50px]">
                    <span class="text-2xl">{{ item.emoji }}</span>
                </ItemMedia>
                <ItemContent>
                    <ItemTitle class="text-lg font-bold">{{ item.version }}</ItemTitle>
                    <ItemDescription>
                        {{ item.description }}
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                </ItemActions>
            </Item>
        </ScrollArea>
    </div>
</template>

<style scoped lang="scss"></style>
