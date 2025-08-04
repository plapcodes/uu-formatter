import type { IActivator, ActivatorConfig } from './activators';
import type { ISelector, SelectorConfig } from './selectors';
import type { ITransformer, TransformerConfig } from './transformers';
import { createActivator } from './activators';
import { createSelector } from './selectors';
import { createTransformer } from './transformers';
import { uuid } from './uuid';

/**
 * A Layer represents a single, self-contained processing step
 * that can be applied to text.
 */
export interface Layer {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  expanded: boolean;
  selected: boolean;
  layerActivator: IActivator;
  selector: ISelector;
  selectionActivator: IActivator;
  transformer: ITransformer;
}

export interface LayerConfig {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  expanded: boolean;
  layerActivator: ActivatorConfig;
  selector: SelectorConfig;
  selectionActivator: ActivatorConfig;
  transformer: TransformerConfig;
}

/**
 * A LayerGroup represnts a collection of layers that will be applied
 * in sequence to the text.
 * It can be used to group related layers together for easier management.
 */
export interface LayerGroup {
  id: string;
  name: string;
  description?: string;
  expanded: boolean;
  enabled: boolean;
  selected: boolean;
  layers: (Layer | LayerGroup)[];
}

export interface LayerGroupConfig {
  id: string;
  name: string;
  description?: string;
  expanded: boolean;
  enabled: boolean;
  layers: (LayerConfig | LayerGroupConfig)[];
}

export function makeLayer(config: LayerConfig, regenerateId: boolean = true): Layer {
  return {
    id: regenerateId ? uuid() : config.id,
    name: config.name,
    description: config.description,
    enabled: config.enabled,
    expanded: config.expanded,
    selected: false,
    layerActivator: createActivator(config.layerActivator),
    selector: createSelector(config.selector),
    selectionActivator: createActivator(config.selectionActivator),
    transformer: createTransformer(config.transformer),
  };
}

export function makeLayerGroup(config: LayerGroupConfig, regenerateId: boolean = true): LayerGroup {
  const layers: (Layer | LayerGroup)[] = [];
  for (const layerConfig of config.layers) {
    if ('layers' in layerConfig) {
      layers.push(makeLayerGroup(layerConfig as LayerGroupConfig));
    } else {
      layers.push(makeLayer(layerConfig as LayerConfig));
    }
  }
  return {
    id: regenerateId ? uuid() : config.id,
    name: config.name,
    description: config.description,
    expanded: config.expanded,
    enabled: config.enabled,
    selected: false,
    layers: layers,
  };
}

export function serializeLayer(layer: Layer): LayerConfig {
  return {
    id: layer.id,
    name: layer.name,
    description: layer.description,
    enabled: layer.enabled,
    expanded: layer.expanded,
    layerActivator: layer.layerActivator.config,
    selector: layer.selector.config,
    selectionActivator: layer.selectionActivator.config,
    transformer: layer.transformer.config,
  };
}

export function serializeLayerGroup(group: LayerGroup): LayerGroupConfig {
  const layers = group.layers.map((layer) => {
    if ('layers' in layer) {
      return serializeLayerGroup(layer);
    } else {
      return serializeLayer(layer);
    }
  });
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    expanded: group.expanded,
    enabled: group.enabled,
    layers: layers,
  };
}

export function processLayers(parentGroup: LayerGroup, text: string): string {
  let processedText = text;

  for (const layer of parentGroup.layers) {
    if ('layers' in layer) {
      // If it's a nested LayerGroup, process it recursively.
      processedText = processLayers(layer, processedText);
    } else {
      // Apply the layer's activator, selector, and transformer.
      if (layer.layerActivator.isActive(processedText)) {
        const ranges = layer.selector.select(processedText);
        for (const range of ranges) {
          const text = processedText.slice(range[0], range[1]);
          if (layer.selectionActivator.isActive(text)) {
            processedText = layer.transformer.transform(text);
          }
        }
      }
    }
  }

  return processedText;
}
