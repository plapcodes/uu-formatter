import { makeLayerGroup, makeLayer } from './layer';
import type { Layer, LayerGroup, LayerConfig, LayerGroupConfig } from './layer';

export * from './layer';

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
    id: 'default',
    name: 'Normal Default Layer Group',
    description: 'This is the default parent group.',
    expanded: true,
    enabled: true,
    layers: [
      {
        id: 'default-layer',
        name: 'Default Layer',
        description: 'This is a default layer with no activator, selector, or transformer.',
        enabled: true,
        activator: { type: 'ALWAYS' as const, options: { enabled: true } },
        selector: { type: 'ENTIRE' as const },
        transformer: { type: 'REMAP' as const, options: { remap: {} } },
      },
      {
        id: 'default-layer-group',
        name: 'Funny Default Layer Group',
        description: 'This is a default layer group with no layers.',
        expanded: false,
        enabled: true,
        layers: [
          {
            id: 'empty-layer',
            name: 'Empty Layer',
            enabled: true,
            description: 'This is an empty layer with no activator, selector, or transformer.',
            activator: { type: 'ALWAYS' as const, options: { enabled: true } },
            selector: { type: 'ENTIRE' as const },
            transformer: { type: 'REMAP' as const, options: { remap: {} } },
          },
        ],
      },
    ],
  };
  return makeLayerGroup(defaultGroupConfig);
}

export function defaultLayerGroup(): LayerGroup {
  const defaultGroupConfig: LayerGroupConfig = {
    id: 'default-layer-group',
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
    id: 'default-layer',
    name: 'Default Layer',
    description: 'This is a default layer with no activator, selector, or transformer.',
    enabled: true,
    activator: { type: 'ALWAYS' as const, options: { enabled: true } },
    selector: { type: 'ENTIRE' as const },
    transformer: { type: 'REMAP' as const, options: { remap: {} } },
  };
  return makeLayer(defaultLayerConfig);
}
