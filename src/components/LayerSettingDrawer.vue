<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import Switch from '@/components/ui/switch/Switch.vue';
import Input from '@/components/ui/input/Input.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import type { ActivatorMetadata, ActivatorConfig } from '@/lib/activators';
import type { SelectorMetadata, SelectorConfig } from '@/lib/selectors';
import type { TransformerMetadata, TransformerConfig } from '@/lib/transformers';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  manifest: ActivatorMetadata | SelectorMetadata | TransformerMetadata;
}>();

const model = defineModel<{
  config: ActivatorConfig | SelectorConfig | TransformerConfig;
}>();
</script>

<template>
  <Drawer>
    <DrawerTrigger>
      <slot></slot>
    </DrawerTrigger>
    <DrawerContent>
      <div class="ml-auto mr-auto w-full max-w-sm justify-self-center">
        <DrawerHeader>
          <DrawerTitle>Layer Settings</DrawerTitle>
          <DrawerDescription> Configure the settings for the selected layer. </DrawerDescription>
        </DrawerHeader>
        <div class="p-4 w-full" v-if="props.manifest">
          <div v-if="props.manifest.parameters.length > 0">
            <div v-for="parameter in props.manifest.parameters" v-bind:key="parameter.key">
              <div
                :class="
                  ['checkbox', 'textInput'].includes(parameter.controlType)
                    ? 'flex flex-row justify-between'
                    : 'flex flex-col'
                "
              >
                <div class="flex flex-col mb-2">
                  <label class="block mb-0.5 text-sm font-medium text-balance">
                    {{ parameter.name }}
                  </label>
                  <p class="text-xs text-muted-foreground">{{ parameter.description }}</p>
                </div>
                <div v-if="model !== undefined && model.config !== undefined">
                  <Switch
                    v-if="parameter.controlType === 'checkbox'"
                    v-model="(model.config.options as Record<string, any>)[parameter.key]"
                  />
                  <Input
                    v-else-if="parameter.controlType === 'textInput'"
                    v-model="(model.config.options as Record<string, any>)[parameter.key]"
                    :placeholder="parameter.placeholder"
                  />
                  <Textarea
                    v-else-if="parameter.controlType === 'textArea'"
                    v-model="(model.config.options as Record<string, any>)[parameter.key]"
                    :placeholder="parameter.placeholder"
                  />
                  <div v-else-if="parameter.controlType === 'doubleText'">
                    <Input
                      v-model="(model.config.options as Record<string, any>)[parameter.key][0]"
                      class="w-1/2"
                    />
                    <Input
                      v-model="(model.config.options as Record<string, any>)[parameter.key][1]"
                      class="w-1/2"
                    />
                  </div>
                  <div
                    v-else-if="parameter.controlType === 'arbitraryLengthDoubleText'"
                    class="flex flex-col gap-2"
                  >
                    <div
                      v-for="(pair, index) in (model.config.options as Record<string, any>)[
                        parameter.key
                      ]"
                      :key="index"
                      class="flex flex-row gap-2 items-center"
                    >
                      <Input
                        v-model="pair[0]"
                        class="w-1/2"
                        :placeholder="parameter.placeholder?.[0] || 'First value'"
                      />
                      <Input
                        v-model="pair[1]"
                        class="w-1/2"
                        :placeholder="parameter.placeholder?.[1] || 'Second value'"
                      />
                      <Button
                        variant="ghost"
                        type="button"
                        size="icon"
                        @click="
                          (model.config.options as Record<string, any>)[parameter.key].splice(
                            index,
                            1,
                          )
                        "
                        aria-label="Remove pair"
                      >
                        <Icon icon="heroicons:trash" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      type="button"
                      class="mt-2"
                      @click="
                        (model.config.options as Record<string, any>)[parameter.key].push(['', ''])
                      "
                    >
                      Add Pair
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <p class="text-balance">No configurable parameters available for this layer.</p>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose as-child>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
</template>
