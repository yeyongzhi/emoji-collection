import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { fetchEmojis, fetchMessages } from "emojibase";
import { toast } from 'vue-sonner'

const EMOJI_LIKE_KEY = 'emoji_like'
const EMOJI_HISTORY_KEY = 'emoji_history'
const LOCAL_HISTORY_COUNT_KEY = 'EMOJI_COLLECTION_HISTORY_COUNT_KEY'
const DEFAULT_HISTORY_COUNT = 50

export type EmojiLikeItem = {
  unicode: string,
  hexcode: string,
}

export const useEmojiStore = defineStore("emoji", () => {
  const loading = ref(false);
  const emojiData = ref<any>([]);
  const emojiGroupData = ref<any>([]);

  const getEmojiData = async () => {
    loading.value = true;
    const zhEmojis = await fetchEmojis("zh", { compact: true });
    // const shortcodes = await fetchShortcodes("zh", 'cldr');
    const messages = await fetchMessages("zh");
    emojiData.value = zhEmojis;
    emojiGroupData.value = messages.groups;
    loading.value = false;
  };

  // 响应式状态
  const likes = ref<EmojiLikeItem[]>([])
  const historySize = ref(Number(localStorage.getItem(LOCAL_HISTORY_COUNT_KEY)) || DEFAULT_HISTORY_COUNT)
  const historySizeOptions = ref([
    { label: '30', value: 30 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: '200', value: 200 },
  ])
  const history = ref<EmojiLikeItem[]>([])
  watch(historySize, (newSize) => {
    localStorage.setItem(LOCAL_HISTORY_COUNT_KEY, newSize.toString())
    toast.success(`历史记录存留个数已更新为 ${newSize}`)
    if (newSize < history.value.length) {
      history.value = history.value.slice(0, newSize)
      localStorage.setItem(EMOJI_HISTORY_KEY, JSON.stringify(history.value))
    }
  })

  // 初始化：从 localStorage 读取
  const init = () => {
    const saved = localStorage.getItem(EMOJI_LIKE_KEY)
    if (saved) {
      try {
        likes.value = JSON.parse(saved)
      } catch (e) {
        likes.value = []
      }
    }
    const historySaved = localStorage.getItem(EMOJI_HISTORY_KEY)
    if (historySaved) {
      try {
        history.value = JSON.parse(historySaved)
      } catch (e) {
        history.value = []
      }
    }
    if(!localStorage.getItem(LOCAL_HISTORY_COUNT_KEY) || localStorage.getItem(LOCAL_HISTORY_COUNT_KEY) === '') {
      localStorage.setItem(LOCAL_HISTORY_COUNT_KEY, DEFAULT_HISTORY_COUNT.toString())
    }
  }

  // 获取收藏列表（直接返回响应式数据）
  const getEmojiLike = computed(() => likes.value)

  // 获取最近使用列表（直接返回响应式数据）
  const getEmojiHistory = computed(() => history.value)

  // 收藏
  const setEmojiLike = (emoji: EmojiLikeItem) => {
    if (!emoji.unicode || likes.value.some(item => item.hexcode === emoji.hexcode)) return

    likes.value.push({
      unicode: emoji.unicode,
      hexcode: emoji.hexcode,
    })
    // 同步到 localStorage
    localStorage.setItem(EMOJI_LIKE_KEY, JSON.stringify(likes.value))
  }

  // 最近使用
  const setEmojiHistory = (emoji: EmojiLikeItem) => {
    if (!emoji.unicode || history.value.some(item => item.hexcode === emoji.hexcode)) return
    if (history.value.length >= historySize.value) {
      history.value.shift()
    }
    history.value.push({
      unicode: emoji.unicode,
      hexcode: emoji.hexcode,
    })
    // 同步到 localStorage
    localStorage.setItem(EMOJI_HISTORY_KEY, JSON.stringify(history.value))
  }

  // 取消收藏
  const cancelEmojiLike = (emoji: EmojiLikeItem) => {
    likes.value = likes.value.filter(item => item.hexcode !== emoji.hexcode)
    localStorage.setItem(EMOJI_LIKE_KEY, JSON.stringify(likes.value))
  }

  // 取消最近使用
  const cancelEmojiHistory = (emoji: EmojiLikeItem) => {
    history.value = history.value.filter(item => item.hexcode !== emoji.hexcode)
    localStorage.setItem(EMOJI_HISTORY_KEY, JSON.stringify(history.value))
  }

  const clearEmojiLike = () => {
    likes.value = []
    localStorage.setItem(EMOJI_LIKE_KEY, JSON.stringify(likes.value))
    toast.success("已清空所有收藏")
  }

  // 清空最近使用
  const clearEmojiHistory = () => {
    history.value = []
    localStorage.setItem(EMOJI_HISTORY_KEY, JSON.stringify(history.value))
    toast.success("已清空所有最近使用")
  }

  // 初始化一次
  init()

  return {
    emojiData,
    emojiGroupData,
    getEmojiData,
    loading,
    setEmojiLike,
    getEmojiLike,
    cancelEmojiLike,
    setEmojiHistory,
    getEmojiHistory,
    cancelEmojiHistory,
    clearEmojiLike,
    clearEmojiHistory,
    historySize,
    historySizeOptions,
  };
});
