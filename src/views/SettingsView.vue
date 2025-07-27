<script setup lang="ts">
import { useConfigStore } from '@/stores/config';
import { useSettingsStore } from '@/stores/settings';
import { Button } from '@/components/ui/button';
import AppSetting from '@/components/AppSetting.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Icon } from '@iconify/vue';

const configStore = useConfigStore();
const settingsStore = useSettingsStore();

settingsStore.$subscribe((mutation, state) => {
  console.log('Config store updated:', mutation, state);
});
</script>

<template>
  <ScrollArea class="w-full">
    <div class="flex flex-col w-full items-center">
      <Collapsible
        class="flex flex-col gap-2 items-center w-sm md:w-lg"
        v-model:open="settingsStore.sidebarSettings"
      >
        <div class="flex flex-row items-center justify-between w-full">
          <span class="text-xl font-bold">Sidebar Settings</span>
          <CollapsibleTrigger>
            <Button variant="ghost">
              <Icon icon="heroicons:chevron-down" />
              <span class="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent class="w-full">
          <AppSetting
            name="Sidebar Open"
            description="Should the sidebar be open by default?"
            v-model="configStore.sidebarOpen"
          />
          <Separator class="my-1" />
          <AppSetting
            name="Persist Sidebar State"
            description="Should the sidebar state persist across sessions?"
            v-model="configStore.persistSidebar"
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  </ScrollArea>
</template>
