import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    sidebarSettings: false as boolean,
  }),
  persist: true,
});
