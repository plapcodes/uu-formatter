import { defineStore } from 'pinia';

export const useConfigStore = defineStore('config', {
  state: () => ({
    sidebarOpen: false as boolean,
    persistSidebar: false as boolean,
    characterCountingInput: false as boolean,
    characterCountingOutput: false as boolean,
    characterCountingAlgorithm: 'default' as 'default' | 'grapheme',
  }),
  persist: true,
});
