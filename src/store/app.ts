import APP_MENU from "@/menu/index";
import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { toast } from 'vue-sonner'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()

const LOCAL_MENU_KEY = 'EMOJI_COLLECTION_MENU_KEY'
const DEFAULT_MENU_KEY = 'base'

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

    const getLocalMenu = () => {
        return localStorage.getItem(LOCAL_MENU_KEY) || DEFAULT_MENU_KEY
    }

    const updateLocalMenu = (key: string) => {
        localStorage.setItem(LOCAL_MENU_KEY, key)
    }

    const menuKey = ref<string>(getLocalMenu())
    const handleMenuSelect = (key: string) => {
        menuKey.value = key
        updateLocalMenu(key)
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
