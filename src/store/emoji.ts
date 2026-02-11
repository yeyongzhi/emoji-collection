import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { fetchFromCDN, fetchEmojis, fetchShortcodes, fetchMessages } from "emojibase";

export const useEmojiStore = defineStore("emoji", () => {
  const loading = ref(false);
  const emojiData = ref<any>([]);
  const emojiGroupData = ref<any>([]);

  const getEmojiData = async () => {
    loading.value = true;
    const zhEmojis = await fetchEmojis("zh", { compact: true });
    // console.log(zhEmojis);
    const shortcodes = await fetchShortcodes("zh", 'cldr');
    // console.log(shortcodes);
    const messages = await fetchMessages("zh");
    // console.log(messages);
    emojiData.value = zhEmojis;
    emojiGroupData.value = messages.groups;
    loading.value = false;
  };

  return {
    emojiData,
    emojiGroupData,
    getEmojiData,
    loading,
  };
});
