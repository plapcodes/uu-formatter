import { makeLayerGroup, makeLayer } from './layer';
import type { Layer, LayerGroup, LayerConfig, LayerGroupConfig } from './layer';
import { uuid } from './uuid';

export * from './layer';
export * from './utils';
export * from './character';

export function deselectAll(group: LayerGroup): LayerGroup {
  const deselectRecursively = (layers: (Layer | LayerGroup)[]): (Layer | LayerGroup)[] => {
    return layers.map((item) => {
      const newItem = { ...item, selected: false };
      if ('layers' in newItem && newItem.layers) {
        newItem.layers = deselectRecursively(newItem.layers);
      }
      return newItem;
    });
  };

  return {
    ...group,
    layers: deselectRecursively(group.layers),
  };
}

export const isLayerGroup = (item: unknown): item is LayerGroup => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'layers' in item &&
    Array.isArray((item as { layers?: unknown }).layers)
  );
};

export function defaultParentGroup(): LayerGroup {
  const defaultGroupConfig: LayerGroupConfig = {
    id: uuid(),
    name: 'Normal Default Layer Group',
    description: 'This is the default parent group.',
    expanded: true,
    enabled: true,
    layers: [
      {
        id: uuid(),
        name: 'Default Layer',
        description: 'This is a default layer with no activator, selector, or transformer.',
        enabled: true,
        expanded: true,
        layerActivator: { type: 'ALWAYS' as const, options: { enabled: true } },
        selector: { type: 'ENTIRE' as const, options: null },
        selectionActivator: { type: 'ALWAYS' as const, options: { enabled: true } },
        transformer: { type: 'REMAP' as const, options: { remap: [] } },
      },
      {
        id: uuid(),
        name: 'Funny Default Layer Group',
        description: 'This is a default layer group with no layers.',
        expanded: false,
        enabled: true,
        layers: [
          {
            id: uuid(),
            name: 'Empty Layer',
            enabled: true,
            expanded: true,
            description: 'This is an empty layer with no activator, selector, or transformer.',
            layerActivator: { type: 'ALWAYS' as const, options: { enabled: true } },
            selector: { type: 'ENTIRE' as const, options: null },
            selectionActivator: { type: 'ALWAYS' as const, options: { enabled: true } },
            transformer: { type: 'REMAP' as const, options: { remap: [] } },
          },
        ],
      },
    ],
  };
  return makeLayerGroup(defaultGroupConfig);
}

export function defaultLayerGroup(): LayerGroup {
  const defaultGroupConfig: LayerGroupConfig = {
    id: uuid(),
    name: 'Default Layer Group',
    description: 'This is a default layer group with no layers.',
    expanded: true,
    enabled: true,
    layers: [],
  };
  return makeLayerGroup(defaultGroupConfig);
}

export function defaultLayer(): Layer {
  const defaultLayerConfig: LayerConfig = {
    id: uuid(),
    name: 'Default Layer',
    description: 'This is a default layer with no activator, selector, or transformer.',
    enabled: true,
    expanded: true,
    layerActivator: { type: 'ALWAYS' as const, options: { enabled: true } },
    selector: { type: 'ENTIRE' as const, options: null },
    selectionActivator: { type: 'ALWAYS' as const, options: { enabled: true } },
    transformer: { type: 'REMAP' as const, options: { remap: [] } },
  };
  return makeLayer(defaultLayerConfig);
}
