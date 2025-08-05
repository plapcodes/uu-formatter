import { defineStore } from 'pinia';

export const useConfigStore = defineStore('config', {
  state: () => ({
    // Sidebar configuration
    sidebarOpen: false as boolean,
    persistSidebar: false as boolean,
    // Character counting
    characterCountingInput: false as boolean,
    characterCountingOutput: false as boolean,
    characterCountingAlgorithm: 'default' as 'default' | 'grapheme',
    // Undo / Redo
    undoHistoryLength: 50 as number,
    redoHistoryLength: 50 as number,
  }),
  persist: true,
});
