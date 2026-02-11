<script setup lang="ts">
import { ref } from 'vue'
import { copyText } from '@/utils/index'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

const { data } = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
})

const copyEmoji = async (str: string) => {
    const res = await copyText(str)
    if (res) {
        toast.success('复制成功')
    } else {
        toast.error('复制失败')
    }
}

const likeEmoji = () => {
    toast.success('收藏成功')
}

const open = ref(false)

</script>

<template>
    <div class="border rounded-xl p-(--padding-s) flex-col justify-center items-center">
        <div title="点击复制" class="value text-center text-2xl" @click="copyEmoji(data.unicode)">{{ data.unicode }}</div>
        <div title="点击复制" class="w-full text-center mt-(--margin-s)" @click="copyEmoji(data.label)">{{ data.label }}
        </div>
        <div class="w-full mt-(--margin-s) flex gap-(--margin-s) justify-center items-center">
            <TooltipProvider>
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
            </TooltipProvider>
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
                        <Button @click="copyEmoji(data.unicode)" class="cursor-pointer">复制</Button>
                        <Button @click="likeEmoji" class="cursor-pointer">收藏</Button>
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
                                <Badge class="px-(--padding-m) py-(--padding-xxs)" v-for="item in data.tags" :key="item">
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
        font-size: var(--text-2xl);
        line-height: var(--text-2xl--line-height);
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
