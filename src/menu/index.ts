import { defineAsyncComponent } from "vue";

const APP_MENU = [
  {
    key: "base",
    name: "基础😀",
    component: defineAsyncComponent(() => import("@/views/base/index.vue")),
  },
  {
    key: "code",
    name: "程序猿常用💻️",
    component: defineAsyncComponent(() => import("@/views/code/index.vue")),
  },
  {
    key: "like",
    name: "我的收藏❤️",
    component: defineAsyncComponent(() => import("@/views/like/index.vue")),
  },
  {
    key: "history",
    name: "最近使用🕒",
    component: defineAsyncComponent(() => import("@/views/history/index.vue")),
  },
  {
    key: "other",
    name: "其他",
    children: [
      {
        key: "version",
        name: "版本信息",
        component: defineAsyncComponent(
          () => import("@/views/version/index.vue"),
        ),
      },
    ],
  },
];

export default APP_MENU;
