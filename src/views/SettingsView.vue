<script setup lang="ts">
import { useConfigStore } from '@/stores/config';
import { useSettingsStore } from '@/stores/settings';
import { Button } from '@/components/ui/button';
import AppSetting from '@/components/AppSetting.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Icon } from '@iconify/vue';
import CenterScreen from '@/components/CenterScreen.vue';

const configStore = useConfigStore();
const settingsStore = useSettingsStore();
</script>

<template>
  <ScrollArea class="w-full">
    <CenterScreen>
      <Collapsible
        class="flex flex-col gap-2 items-center"
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
      <Collapsible
        class="flex flex-col gap-2 items-center"
        v-model:open="settingsStore.editorSettings"
      >
        <div class="flex flex-row items-center justify-between w-full">
          <span class="text-xl font-bold">Editor Settings</span>
          <CollapsibleTrigger>
            <Button variant="ghost">
              <Icon icon="heroicons:chevron-down" />
              <span class="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent class="w-full">
          <AppSetting
            name="Input Character Counting"
            description="Should character counting be enabled for the input textarea?"
            v-model="configStore.characterCountingInput"
          />
          <Separator class="my-1" />
          <AppSetting
            name="Output Character Counting"
            description="Should character counting be enabled for the output textarea?"
            v-model="configStore.characterCountingOutput"
          />
        </CollapsibleContent>
      </Collapsible>
    </CenterScreen>
  </ScrollArea>
</template>
