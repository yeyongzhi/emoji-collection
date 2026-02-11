import { defineAsyncComponent } from 'vue'

const APP_MENU = [
    {
        key: "base",
        name: "基础😀",
        component: () => defineAsyncComponent(() => import('@/views/base/index.vue'))
    },
    {
        key: "code",
        name: "程序猿常用💻️"
    }
]

export default APP_MENU