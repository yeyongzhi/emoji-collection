import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { fetchEmojis, fetchMessages } from "emojibase";
import { toast } from 'vue-sonner'

const EMOJI_LIKE_KEY = 'emoji_like'
const EMOJI_HISTORY_KEY = 'emoji_history'

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
  const history = ref<EmojiLikeItem[]>([])

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
  };
});
