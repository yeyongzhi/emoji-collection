import APP_MENU from "@/menu/index";
import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { toast } from 'vue-sonner'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()

export const useAppStore = defineStore("app", () => {
  const themeOptions = [
    {
      label: "亮色模式",
      value: "light",
    },
    {
      label: "暗色模式",
      value: "dark",
    },
  ];
  const isDark = ref<boolean>(false);
  watch(isDark, (newVal) => {
    toast.success(newVal ? "已切换到暗色模式" : "已切换到亮色模式")
    mode.value = newVal ? 'dark' : 'light'
  })

  const menuKey = ref<string>("base")
  const handleMenuSelect = (key: string) => {
    menuKey.value = key
  }
  const currentMenuComponent = computed(() => {
    let targetMenu: any = null
    APP_MENU.forEach((item) => {
      if (item.key === menuKey.value) {
        targetMenu = item
      } else if (item.children) {
        item.children.forEach((child) => {
          if (child.key === menuKey.value) {
            targetMenu = child
          }
        })
      }
    })
    return targetMenu?.component || null
  })

  return {
    themeOptions,
    isDark,
    menuKey,
    handleMenuSelect,
    currentMenuComponent
  };
});
