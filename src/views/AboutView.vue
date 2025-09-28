<script setup lang="ts">
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue';
</script>

<template>
  <ScrollArea class="w-sm md:w-lg">
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      About
    </h2>
    <p className="leading-7 [&:not(:first-child)]:mt-6 text-justify">
      UU-Formatter is a free and open-source tool to help you format text your way using customizable, markdown-like syntax.
    </p>
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-10">
      Issues & Feedback
    </h2>
    <p className="leading-7 [&:not(:first-child)]:mt-6 text-justify">
      If you encounter any issues or have suggestions for new features, please visit the
      <a href="https://github.com/plapcodes/uu-formatter/issues" target="_blank" class="text-blue-600 underline">GitHub Issues page</a>.
      Please try <b>not</b> to inform me of issues on any other platforms, but feel free to
      poke me if I don't respond in a timely manner.
    </p>
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-10">
      Usage Guides
    </h2>
    <p className="leading-7 [&:not(:first-child)]:mt-6 text-justify">
      For a comprehensive guide on how to use UU-Formatter, please visit the
      <a href="https://github.com/plapcodes/uu-formatter/wiki" target="_blank" class="text-blue-600 underline">GitHub Wiki</a>.
    </p>
  </ScrollArea>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
