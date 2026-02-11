import APP_MENU from "@/menu/index";
import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { toast } from 'vue-sonner'

const DEFAULT_THEME = "light";

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
  })

  const menuKey = ref<string>("base")
  const handleMenuSelect = (key: string) => {
    console.log(key)
    menuKey.value = key
  }
  const currentMenuComponent = computed(() => {
    const menu = APP_MENU.find((item) => item.key === menuKey.value)
    return menu?.component || null
  })

  return {
    themeOptions,
    isDark,
    menuKey,
    handleMenuSelect,
    currentMenuComponent
  };
});
