<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/store/index'
import APP_MENU from '@/menu/index'

const appStore = useAppStore()

</script>

<template>
  <div class="border border-b w-full flex justify-between items-center h-[60px] p-(--padding-l) box-border">
    <div class="font-bold text-2xl flex items-center">
      Emoji 使用指南【看这就够了】
    </div>
    <div class="flex justify-center items-center gap-x-(--margin-xs)">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem v-for="menu in APP_MENU" :key="menu.key">
            <NavigationMenuLink as-child v-if="!menu.children">
              <a class="cursor-pointer" @click="appStore.handleMenuSelect(menu.key)">{{ menu.name }}</a>
              <div v-if="menu.key === appStore.menuKey" class="w-full h-[2px] bg-(--color-primary)"></div>
            </NavigationMenuLink>
            <template v-else>
              <NavigationMenuTrigger>{{ menu.name }}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul class="grid w-[100px] gap-(--margin-xs)">
                  <li v-for="item in menu.children" :key="item.key">
                    <NavigationMenuLink as-child>
                      <a class="cursor-pointer" @click="appStore.handleMenuSelect(item.key)">{{ item.name }}</a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </template>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Switch v-model="appStore.isDark" />
          </TooltipTrigger>
          <TooltipContent>
            <p>切换主题</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
