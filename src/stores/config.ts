import { defineStore } from 'pinia';

export const useConfigStore = defineStore('config', {
  state: () => ({
    sidebarOpen: false as boolean,
    persistSidebar: false as boolean,
  }),
  persist: true,
});
