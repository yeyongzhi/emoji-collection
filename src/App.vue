<script setup lang="ts">
import Header from '@/layout/Header.vue'
import Content from '@/layout/Content.vue'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center">
    <Header />
    <Content />
    <!-- <Button>Click me</Button> -->
     <Toaster position="top-center" closeButtonPosition="top-right" />
  </div>
</template>

<style scoped lang="scss">
</style>
