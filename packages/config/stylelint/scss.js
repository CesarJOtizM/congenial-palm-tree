import { baseConfig } from './base.js';

/**
 * A custom Stylelint configuration for projects that use SCSS.
 *
 * @type {import("stylelint").Config}
 */
export const scssConfig = {
  ...baseConfig,
  extends: ['stylelint-config-standard-scss'],
  plugins: [...baseConfig.plugins, 'stylelint-scss'],
  rules: {
    ...baseConfig.rules,
    // Reglas específicas de SCSS
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind'],
      },
    ],
    'scss/at-import-partial-extension': 'always',
    'scss/at-import-partial-extension-blacklist': ['.scss'],
    'scss/at-import-no-partial-leading-underscore': true,
    'scss/at-mixin-argumentless-call-parentheses': 'always',
    'scss/at-mixin-named-arguments': 'always',
    'scss/at-mixin-parentheses-space-before': 'never',
    'scss/at-rule-conditional-no-parentheses': true,
    'scss/comment-no-empty': true,
    'scss/declaration-nested-properties': 'never',
    'scss/dollar-variable-colon-newline-after': 'always-multi-line',
    'scss/dollar-variable-colon-space-after': 'always-single-line',
    'scss/dollar-variable-colon-space-before': 'never',
    'scss/dollar-variable-default': [
      true,
      {
        ignore: 'local',
      },
    ],
    'scss/dollar-variable-empty-line-after': [
      'always',
      {
        except: ['last-nested', 'before-dollar-variable'],
        ignore: ['before-comment'],
      },
    ],
    'scss/dollar-variable-empty-line-before': [
      'always',
      {
        except: ['first-nested', 'after-dollar-variable'],
        ignore: ['after-comment'],
      },
    ],
    'scss/dollar-variable-no-namespaced-assignment': true,
    'scss/dollar-variable-pattern': '^[a-z][a-zA-Z0-9]+$',
    'scss/double-slash-comment-inline': [
      'always',
      {
        severity: 'error',
      },
    ],
    'scss/double-slash-comment-whitespace-inside': 'always',
    'scss/function-quote-no-quoted-strings-inside': true,
    'scss/function-unquote-no-unquoted-strings-inside': true,
    'scss/map-keys-quotes': 'always',
    'scss/no-duplicate-dollar-variables': [
      true,
      {
        ignore: ['local'],
      },
    ],
    'scss/no-duplicate-mixins': true,
    'scss/no-global-function-names': true,
    'scss/operator-no-newline-after': true,
    'scss/operator-no-newline-before': true,
    'scss/operator-no-unspaced': true,
    'scss/partial-no-import': true,
    'scss/selector-nest-combinators': 'always',
    'scss/selector-no-redundant-nesting-selector': true,
    'scss/selector-no-union-class-name': true,
  },
};
