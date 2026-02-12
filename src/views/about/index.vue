<script setup lang="ts">
import { reactive } from 'vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Item,
    ItemActions,
    ItemContent,
    ItemMedia,
    ItemDescription,
    ItemTitle,
} from '@/components/ui/item'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/app'
import { openLink } from '@/utils/index'
import WeChatImg from '@/assets/images/wechat.png'

const appStore = useAppStore()

const dialogInfo = reactive({
    visible: false,
    title: '',
})

const showDialog = (title: string) => {
    dialogInfo.title = title
    dialogInfo.visible = true
}

</script>

<template>
    <div class="w-full h-full">
        <ScrollArea class="w-[50%] h-full">
            <Item variant="muted" class="mb-(--margin-l)">
                <ItemContent>
                    <ItemTitle>这是一个基于 Vue3 和 shadcn ui 的 emoji
                        选择器😀</ItemTitle>
                    <ItemDescription>
                        我相信在你的项目中会有很多地方会用到这些。为此，我开发了一些功能，简单介绍一下
                    </ItemDescription>
                </ItemContent>
            </Item>
            <Item variant="muted" class="mb-(--margin-l)">
                <ItemMedia variant="icon">
                    <span class="text-2xl">😀</span>
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>基础的Emoji大集合</ItemTitle>
                    <ItemDescription>
                        你可以挑选你需要的Emoji使用
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                    <Button class="cursor-pointer" @click="appStore.handleMenuSelect('base')">
                        去看看
                    </Button>
                </ItemActions>
            </Item>
            <Item variant="muted" class="mb-(--margin-l)">
                <ItemMedia variant="icon">
                    <span class="text-2xl">💻️</span>
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>.程序猿使用的一些Emoji</ItemTitle>
                    <ItemDescription>
                        这里有包含Git常用提交规范、🔧通用开发 & 工具等多处可能会使用到的Emoji，我相信你会感兴趣
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                    <Button class="cursor-pointer" @click="appStore.handleMenuSelect('code')">
                        去看看
                    </Button>
                </ItemActions>
            </Item>
            <Item variant="muted" class="mb-(--margin-l)">
                <ItemMedia variant="icon">
                    <span class="text-2xl">❤️</span>
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>你可以快速的收藏一些你喜欢的Emoji</ItemTitle>
                    <ItemDescription>
                        在我的收藏中可以看到
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                    <Button class="cursor-pointer" @click="appStore.handleMenuSelect('like')">
                        去看看
                    </Button>
                </ItemActions>
            </Item>
            <Item variant="muted" class="mb-(--margin-l)">
                <ItemMedia variant="icon">
                    <span class="text-2xl">📦️</span>
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>项目地址</ItemTitle>
                    <ItemDescription>
                        点击右侧按钮查看
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                    <Button variant="outline" class="cursor-pointer" @click="openLink('https://github.com/yeyongzhi/emoji-collection')">
                        GitHub
                    </Button>
                    <Button v-if="false" variant="outline" class="cursor-pointer" @click="openLink('https://yeyongzhi.github.io/emoji-collection/')">
                        预览地址
                    </Button>
                </ItemActions>
            </Item>
            <Item variant="muted" class="mb-(--margin-l)">
                <ItemMedia variant="icon">
                    <span class="text-2xl">☎️</span>
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>联系我</ItemTitle>
                    <ItemDescription>
                        点击右侧按钮查看
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                    <Button variant="outline" class="cursor-pointer" @click="showDialog('WeChat')">
                        WeChat
                    </Button>
                    <Button variant="outline" class="cursor-pointer" @click="openLink('https://github.com/yeyongzhi')">
                        GitHub主页
                    </Button>
                </ItemActions>
            </Item>
        </ScrollArea>
        <Dialog v-model:open="dialogInfo.visible">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{{ dialogInfo.title }}</DialogTitle>
                </DialogHeader>
                <div class="w-full p-(--padding-m)">
                    <img :src="WeChatImg" alt="WeChat" class="w-full h-auto">
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<style scoped lang="scss"></style>
