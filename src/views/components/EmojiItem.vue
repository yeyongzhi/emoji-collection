<script setup lang="ts">
import { ref, computed } from 'vue'
import { copyText } from '@/utils/index'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { useEmojiStore, type EmojiLikeItem } from '@/store/emoji'

const emojiStore = useEmojiStore()

const { data, showLabel } = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    showLabel: {
        type: Boolean,
        default: true
    }
})

const copyEmoji = async (str: string, isUnicode: boolean = false) => {
    const res = await copyText(str)
    if(isUnicode) {
        emojiStore.setEmojiHistory(data as EmojiLikeItem)
    }
    if (res) {
        toast.success('复制成功')
    } else {
        toast.error('复制失败')
    }
}

const likeEmoji = () => {
    if (!isLike.value) {
        emojiStore.setEmojiLike(data as EmojiLikeItem)
        toast.success('收藏成功')
    } else {
        emojiStore.cancelEmojiLike(data as EmojiLikeItem)
        toast.error('已取消收藏')
    }

}

const open = ref(false)

const isLike = computed(() => {
    let hexcodes = emojiStore.getEmojiLike.map(item => item.hexcode)
    return hexcodes.includes(data.hexcode)
})

</script>

<template>
    <div class="border border-2 rounded-xl p-(--padding-s) flex-col justify-center items-center">
        <div title="点击复制" class="value text-center text-2xl" @click="copyEmoji(data.unicode, true)">{{ data.unicode }}</div>
        <div v-if="showLabel" title="点击复制" class="text-sm w-full text-center mt-(--margin-s)" @click="copyEmoji(data.label)">{{
            data.label }}</div>
        <TooltipProvider v-if="data.description && data.description !== ''">
            <Tooltip>
                <TooltipTrigger class="w-full">
                    <div class="text-muted-foreground text-xs w-full text-center mt-(--margin-s) overflow-hidden whitespace-nowrap text-ellipsis">
                        Tips: {{ data.description }}</div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{{ data.description }}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <div class="w-full mt-(--margin-s) flex gap-(--margin-xs) justify-center items-center">
            <Button @click="open = true" size="sm" variant="secondary" class="cursor-pointer">详情</Button>
            <Button @click="likeEmoji" size="sm" :variant="isLike ? 'default' : 'secondary'" class="cursor-pointer">{{
                isLike ? '取消收藏' : '收藏' }}</Button>
            <!-- <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Button @click="open = true" size="sm" variant="secondary" class="cursor-pointer">详情</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>点击查看详情</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Button size="sm" variant="secondary" class="cursor-pointer">收藏</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>点击收藏</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider> -->
        </div>
        <Dialog v-model:open="open">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>emoji 详情</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div class="w-full p-(--padding-m)">
                    <div class="text-center text-8xl">{{ data.unicode }}</div>
                    <div
                        class="w-full mt-(--margin-xl) p-(--padding-m) flex gap-(--margin-m) justify-center items-center">
                        <Button variant="secondary" @click="copyEmoji(data.unicode)" class="cursor-pointer">复制</Button>
                        <Button variant="secondary" @click="likeEmoji" class="cursor-pointer">收藏</Button>
                    </div>
                    <div
                        class="details w-full mx-auto mt-(--margin-xl) p-(--padding-m) flex flex-col gap-(--margin-m) justify-center items-center">
                        <div class="flex w-full justify-between items-center">
                            <div class="w-[100px]">
                                编码
                            </div>
                            <div class="flex-1">
                                {{ data.hexcode }}
                            </div>
                        </div>
                        <div class="flex w-full justify-between items-start">
                            <div class="w-[100px]">
                                标签
                            </div>
                            <div class="flex-1 flex w-full flex-wrap gap-(--margin-m)">
                                <Badge class="px-(--padding-m) py-(--padding-xxs)" v-for="item in data.tags"
                                    :key="item">
                                    {{ item }}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<style scoped lang="scss">
.value {
    &:hover {
        cursor: pointer;
        scale: 1.6;
        transition: all 0.2s ease-in-out;
    }
}

.details {
    .label {
        font-size: var(--text-md);
        line-height: var(--text-md--line-height);
    }

    .value {
        font-size: var(--text-md);
        line-height: var(--text-md--line-height);
    }
}
</style>
