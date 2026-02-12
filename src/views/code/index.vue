<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useEmojiStore } from '@/store/emoji'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import EmojiItem from '@/views/components/EmojiItem.vue'

const emojiStore = useEmojiStore()

const data = ref<any>([])
const tabs = ref<any>([])
const tabKey = ref('top')

const tabData = computed(() => {
    let target = data.value.find((item: any) => item.key === tabKey.value)
    if (!target) {
        return []
    }
    return target.data
})

const tabShowData = computed(() => {
    let list: any[] = []
    tabData.value.forEach((item: any) => {
        let target = emojiStore.emojiData.find((emoji: any) => emoji.hexcode === item.hexcode)
        if (target) {
            list.push({
            ...item,
            ...target
        })
        }
    })
    return list
})

onMounted(() => {
    fetch('./coderEmoji.json')
        .then(res => res.json())
        .then(result => {
            console.log(result)
            data.value = result.data
            tabs.value = result.data.map((item: any) => ({
                key: item.key,
                name: item.name
            }))
            if (tabs.value.length > 0) {
                tabKey.value = tabs.value[0].key
            }
        })
})

</script>

<template>
    <div class="w-full h-full flex flex-col gap-y-(--margin-l)">
        <Tabs v-model="tabKey">
            <TabsList>
                <TabsTrigger :value="tab.key" v-for="tab in tabs" :key="tab.key">
                    {{ tab.name }}
                </TabsTrigger>
            </TabsList>
        </Tabs>
        <div class="w-full flex-1">
            <ScrollArea class="w-full h-full">
                <div class="w-full grid grid-cols-8 gap-(--margin-s)">
                    <div v-for="(emoji, index) in tabShowData" :key="emoji.key">
                        <p class="text-sm text-center font-bold mb-(--margin-s)" v-if="tabKey === 'top'">
                            <span v-if="index < 3">🔥</span>
                            Top {{ index + 1 }}
                        </p>
                        <EmojiItem :data="emoji" :showLabel="false" />
                    </div>
                </div>
            </ScrollArea>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
