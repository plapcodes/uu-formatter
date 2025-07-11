<script setup lang="ts">
const props = defineProps<{
  text: string;
}>();
defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <button
    class="cursor-pointer relative text-slate-200 after:text-slate-200 after:absolute after:text-nowrap after:scale-0 hover:after:scale-100 after:duration-200 w-12 h-12 pointer flex items-center justify-center duration-300 hover:rounded-3xl hover:w-32 group/button overflow-hidden active:scale-90 rounded-2xl hover:bg-slate-600 after:content-[var(--after-content)]"
    :style="{ '--after-content': `'${props.text}'` }"
    @click="$emit('click')"
  >
    <div
      class="w-6 text-slate-200 fill-slate-200 delay-50 duration-200 group-hover/button:-translate-y-12"
    >
      <slot name="icon"></slot>
    </div>
  </button>
</template>
