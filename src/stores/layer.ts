import { defineStore } from 'pinia';
import { defaultParentGroup, type LayerGroup } from '@/lib';

export const useLayerStore = defineStore('layer', {
  state: () => ({
    parentGroup: null as LayerGroup | null,
  }),
  persist: true,
  actions: {
    initializeParentGroup() {
      if (this.parentGroup === null) {
        this.parentGroup = defaultParentGroup() as LayerGroup;
      }
    },
  },
});
