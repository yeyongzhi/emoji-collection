<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu'
import { useAppStore } from '@/store/index'
import APP_MENU from '@/menu/index'

const appStore = useAppStore()

</script>

<template>
  <div
    class="header_container border border-b w-full flex justify-between items-center h-[60px] p-(--padding-l) box-border">
    <div class="font-bold text-2xl">Emoji Collection</div>
    <div class="flex justify-center items-center gap-x-(--margin-xs)">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem v-for="menu in APP_MENU" :key="menu.key">
            <NavigationMenuLink as-child>
              <a @click="appStore.handleMenuSelect(menu.key)">{{ menu.name }}</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Switch v-model="appStore.isDark" />
      <Button>切换主题</Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header_container {}
</style>
