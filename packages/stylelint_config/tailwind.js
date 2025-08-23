import { baseConfig } from './base.js';

/**
 * A custom Stylelint configuration for projects that use Tailwind CSS.
 *
 * @type {import("stylelint").Config}
 */
export const tailwindConfig = {
  ...baseConfig,
  extends: ['stylelint-config-standard', 'stylelint-config-tailwindcss'],
  plugins: [...baseConfig.plugins, 'stylelint-order'],
  rules: {
    ...baseConfig.rules,
    'order/order': [
      [
        'custom-properties',
        'at-rules',
        'declarations',
        {
          type: 'at-rule',
          name: 'tailwind',
        },
        'rules',
      ],
    ],
    'order/properties-order': [
      [
        'position',
        'top',
        'right',
        'bottom',
        'left',
        'z-index',
        'display',
        'flex',
        'flex-direction',
        'flex-wrap',
        'flex-flow',
        'flex-grow',
        'flex-shrink',
        'flex-basis',
        'justify-content',
        'align-items',
        'align-content',
        'order',
        'float',
        'clear',
        'width',
        'min-width',
        'max-width',
        'height',
        'min-height',
        'max-height',
        'margin',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left',
        'padding',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left',
        'font',
        'font-family',
        'font-size',
        'font-weight',
        'line-height',
        'color',
        'background',
        'background-color',
        'border',
        'border-radius',
        'box-shadow',
        'overflow',
        'opacity',
        'transition',
      ],
    ],
    // Configuración específica para Tailwind
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'layer', 'screen'],
      },
    ],
  },
};
