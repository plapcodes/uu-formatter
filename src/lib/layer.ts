import type { IActivator, ActivatorConfig } from './activators';
import type { ISelector, SelectorConfig } from './selectors';
import type { ITransformer, TransformerConfig } from './transformers';
import { createActivator } from './activators';
import { createSelector } from './selectors';
import { createTransformer } from './transformers';

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
  activator: IActivator;
  selector: ISelector;
  transformer: ITransformer;
}

export interface LayerConfig {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  expanded: boolean;
  activator: ActivatorConfig;
  selector: SelectorConfig;
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

export function makeLayer(config: LayerConfig): Layer {
  return {
    id: config.id,
    name: config.name,
    description: config.description,
    enabled: config.enabled,
    expanded: config.expanded,
    selected: false,
    activator: createActivator(config.activator),
    selector: createSelector(config.selector),
    transformer: createTransformer(config.transformer),
  };
}

export function makeLayerGroup(config: LayerGroupConfig): LayerGroup {
  const layers: (Layer | LayerGroup)[] = [];
  for (const layerConfig of config.layers) {
    if ('layers' in layerConfig) {
      layers.push(makeLayerGroup(layerConfig as LayerGroupConfig));
    } else {
      layers.push(makeLayer(layerConfig as LayerConfig));
    }
  }
  return {
    id: config.id,
    name: config.name,
    description: config.description,
    expanded: config.expanded,
    enabled: config.enabled,
    selected: false,
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
      if (layer.activator.isActive(processedText)) {
        const ranges = layer.selector.select(processedText);
        processedText = layer.transformer.transform(processedText, ranges);
      }
    }
  }

  return processedText;
}
