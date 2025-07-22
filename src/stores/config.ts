import { defineStore } from 'pinia';

export const useConfigStore = defineStore('config', {
  state: () => ({
    sidebarOpen: false as boolean,
  }),
  persist: true,
});
