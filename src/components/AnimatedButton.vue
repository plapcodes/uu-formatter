<script setup lang="ts">
const props = defineProps<{
  text: string;
  backgroundColor: string;
}>();
</script>

<template>
  <button :class="backgroundColor">
    <div class="svg-wrapper-1">
      <div class="svg-wrapper text-slate-200">
        <slot name="icon"></slot>
      </div>
    </div>
    <span class="text-slate-200">{{ props.text }}</span>
  </button>
</template>

<style scoped>
button {
  font-family: inherit;
  font-size: 20px;
  padding: 0.7em 1em;
  padding-left: 0.9em;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
}

button span {
  display: block;
  margin-left: 0.3em;
  transition: all 0.3s ease-in-out;
}

button svg {
  display: block;
  transform-origin: center center;
  transition: transform 0.3s ease-in-out;
}

button:hover .svg-wrapper {
  animation: fly-1 0.6s ease-in-out infinite alternate;
}

button:active {
  transform: scale(0.95);
}

@keyframes fly-1 {
  from {
    transform: translateY(0.1em);
  }

  to {
    transform: translateY(-0.1em);
  }
}
</style>
