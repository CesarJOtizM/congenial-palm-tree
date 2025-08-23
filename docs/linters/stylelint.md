# Stylelint - Análisis de CSS/SCSS

## 🎯 ¿Qué es Stylelint?

Stylelint es un linter estático para CSS, SCSS y otros preprocesadores que analiza tus estilos para encontrar problemas, inconsistencias y violaciones de reglas. En nuestro proyecto, Stylelint es la herramienta principal para mantener la calidad y consistencia de los estilos.

### Propósito Principal

- **🔍 Detectar errores**: Encuentra problemas en CSS antes de que lleguen a producción
- **📏 Mantener consistencia**: Asegura que todos los estilos sigan las mismas convenciones
- **🚀 Mejorar mantenibilidad**: Ordena propiedades y aplica mejores prácticas
- **🛡️ Prevenir problemas**: Identifica propiedades ignoradas y valores problemáticos

## ⚙️ Configuración Actual

### Versión

- **Stylelint**: 16.2.1
- **Configuración**: Modular con configuraciones específicas por tipo

### Estructura de Configuración

```
packages/stylelint_config/
├── index.js          # Exporta todas las configuraciones
├── base.js           # Configuración base para CSS
├── scss.js           # Configuración específica para SCSS
└── tailwind.js       # Configuración específica para Tailwind CSS
```

### Configuraciones Disponibles

#### 1. **baseConfig** - Configuración Base

```javascript
// .stylelintrc.js
import { baseConfig } from '@repo/stylelint_config';
export default baseConfig;
```

**Uso**: CSS puro, estilos básicos

#### 2. **scssConfig** - Configuración SCSS

```javascript
// .stylelintrc.js
import { scssConfig } from '@repo/stylelint_config';
export default scssConfig;
```

**Uso**: Archivos SCSS, preprocesadores

#### 3. **tailwindConfig** - Configuración Tailwind

```javascript
// .stylelintrc.js
import { tailwindConfig } from '@repo/stylelint_config';
export default tailwindConfig;
```

**Uso**: Proyectos con Tailwind CSS

## 📋 Reglas y Configuraciones

### 🔧 Plugins Incluidos

#### Stylelint Order

- **Propósito**: Ordenamiento automático de propiedades CSS
- **Características**: 400+ propiedades ordenadas lógicamente
- **Beneficios**: Consistencia visual y mejor mantenibilidad

#### Stylelint Declaration Block No Ignored Properties

- **Propósito**: Detectar propiedades que son ignoradas por otras
- **Ejemplo**: `display: block` ignora `width: auto`
- **Beneficios**: Evita código innecesario y confuso

#### Stylelint SCSS

- **Propósito**: Reglas específicas para SCSS
- **Características**: Soporte para variables, mixins, funciones
- **Beneficios**: Validación de sintaxis SCSS

#### Stylelint Tailwind CSS

- **Propósito**: Reglas específicas para Tailwind CSS
- **Características**: Validación de clases de utilidad
- **Beneficios**: Consistencia con Tailwind

### 🎯 Reglas Principales

#### Ordenamiento de Propiedades CSS

Nuestro sistema ordena las propiedades CSS en un orden lógico específico:

```javascript
'order/properties-order': [
  [
    // 1. Posicionamiento y layout
    'position', 'top', 'right', 'bottom', 'left', 'z-index',

    // 2. Display y flexbox
    'display', 'flex', 'flex-direction', 'flex-wrap', 'flex-grow',
    'flex-shrink', 'flex-basis', 'align-items', 'justify-content',

    // 3. Dimensiones
    'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',

    // 4. Espaciado
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',

    // 5. Tipografía
    'font-family', 'font-size', 'font-weight', 'line-height', 'text-align',
    'color', 'text-decoration', 'text-transform',

    // 6. Colores y fondos
    'background', 'background-color', 'background-image', 'background-size',
    'background-position', 'background-repeat',

    // 7. Bordes y efectos
    'border', 'border-radius', 'box-shadow', 'opacity',

    // 8. Transformaciones y animaciones
    'transform', 'transition', 'animation',

    // 9. Interactividad
    'cursor', 'pointer-events', 'user-select'
  ]
]
```

**Ejemplo de CSS ordenado**:

```css
.button {
  /* 1. Posicionamiento */
  position: relative;
  z-index: 10;

  /* 2. Display */
  display: flex;
  align-items: center;
  justify-content: center;

  /* 3. Dimensiones */
  width: 200px;
  height: 50px;

  /* 4. Espaciado */
  margin: 10px;
  padding: 12px 24px;

  /* 5. Tipografía */
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;

  /* 6. Colores y fondos */
  background-color: #3b82f6;
  background-image: linear-gradient(to right, #3b82f6, #1d4ed8);

  /* 7. Bordes y efectos */
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  /* 8. Transformaciones */
  transition: all 0.2s ease;

  /* 9. Interactividad */
  cursor: pointer;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
```

#### Detección de Propiedades Ignoradas

```javascript
'declaration-block-no-ignored-properties': true,
```

**Ejemplos**:

```css
/* ❌ Error: display: block ignora width: auto */
.element {
  display: block;
  width: auto; /* Esta propiedad es ignorada */
}

/* ✅ Correcto: solo display: block */
.element {
  display: block;
}

/* ✅ Correcto: width con display que no lo ignora */
.element {
  display: inline-block;
  width: 200px;
}
```

#### Reglas de Consistencia

```javascript
// Permitir patrones de clase personalizados (para Tailwind)
'selector-class-pattern': null,

// Permitir strings con saltos de línea (para contenido)
'string-no-newline': null,

// Permitir funciones desconocidas (para SCSS)
'function-no-unknown': null,

// Permitir patrones de propiedades personalizadas
'custom-property-pattern': null,
```

### 🎨 Configuraciones Específicas

#### Configuración SCSS

```javascript
// scss.js
export const scssConfig = {
  extends: ['stylelint-config-standard-scss', baseConfig],
  plugins: [
    'stylelint-scss',
    'stylelint-order',
    'stylelint-declaration-block-no-ignored-properties',
  ],
  rules: {
    // Reglas específicas para SCSS
    'scss/at-rule-no-unknown': true,
    'scss/selector-no-redundant-nesting-selector': true,
    'scss/no-global-function-names': true,
  },
};
```

**Características SCSS**:

- ✅ Variables (`$color-primary`)
- ✅ Mixins (`@mixin button-style`)
- ✅ Funciones (`@function calculate-width`)
- ✅ Anidamiento (`&:hover`)
- ✅ Importaciones (`@import 'variables'`)

#### Configuración Tailwind

```javascript
// tailwind.js
export const tailwindConfig = {
  extends: ['stylelint-config-tailwindcss', baseConfig],
  rules: {
    // Reglas específicas para Tailwind
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'layer'],
      },
    ],
  },
};
```

**Características Tailwind**:

- ✅ Clases de utilidad (`bg-blue-500`)
- ✅ Directivas (`@tailwind`, `@apply`)
- ✅ Capas (`@layer components`)
- ✅ Configuración personalizada

## 🚀 Uso y Comandos

### Comandos Principales

```bash
# Ejecutar Stylelint en todo el proyecto
bun run stylelint

# Ejecutar Stylelint con corrección automática
bun run stylelint:fix

# Ejecutar Stylelint en archivos específicos
npx stylelint "src/**/*.{css,scss}"

# Ejecutar Stylelint con debug
npx stylelint --debug "src/styles.css"
```

### Integración con VS Code

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  },
  "stylelint.validate": ["css", "scss"]
}
```

### Configuración de Archivos Ignorados

```javascript
ignoreFiles: [
  '**/*.d.ts',
  'node_modules/**/*',
  '.next/**/*',
  'dist/**/*',
  'build/**/*',
  'coverage/**/*',
  // Archivos específicos del proyecto
  './src/styles/outlinedInput.scss',
  './src/components/atoms/select/select.module.scss/',
  './src/styles/responseDetail.module.scss',
  './src/devlink/**/*',
];
```

## 📁 Estructura de Estilos Recomendada

### Organización de Archivos

```
src/
├── styles/
│   ├── globals.css          # Estilos globales
│   ├── variables.scss       # Variables SCSS
│   ├── mixins.scss          # Mixins SCSS
│   ├── components/          # Estilos de componentes
│   │   ├── button.scss
│   │   └── card.scss
│   └── utilities/           # Clases de utilidad
│       ├── spacing.scss
│       └── typography.scss
```

### Convenciones de Nomenclatura

#### Clases CSS

```css
/* ✅ BEM Methodology */
.button {
}
.button--primary {
}
.button__icon {
}

/* ✅ Utility Classes */
.text-center {
}
.mt-4 {
}
.flex {
}

/* ✅ Component Classes */
.user-card {
}
.nav-menu {
}
```

#### Variables SCSS

```scss
/* ✅ Variables de color */
$color-primary: #3b82f6;
$color-secondary: #64748b;
$color-success: #10b981;

/* ✅ Variables de espaciado */
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;

/* ✅ Variables de tipografía */
$font-family-base: 'Inter', sans-serif;
$font-size-base: 16px;
$line-height-base: 1.5;
```

## 🔍 Troubleshooting

### Problemas Comunes

#### 1. Propiedades No Ordenadas

**Síntoma**: Error de ordenamiento en propiedades CSS
**Solución**: Ejecutar `bun run stylelint:fix` para ordenar automáticamente

#### 2. Propiedades Ignoradas

**Síntoma**: Error por propiedades que no tienen efecto
**Solución**: Eliminar propiedades innecesarias o cambiar el contexto

#### 3. Conflictos con Tailwind

**Síntoma**: Error en clases de Tailwind
**Solución**: Verificar que se use la configuración `tailwindConfig`

### Comandos de Diagnóstico

```bash
# Ver configuración aplicada
npx stylelint --print-config src/styles.css

# Ver reglas activas
npx stylelint --print-config src/styles.css | grep -A 10 "rules"

# Debug de configuración
npx stylelint --debug src/styles.css
```

## 📚 Recursos Adicionales

- [Documentación oficial de Stylelint](https://stylelint.io/)
- [Stylelint Order Plugin](https://github.com/hudochenkov/stylelint-order)
- [Stylelint SCSS](https://github.com/stylelint-scss/stylelint-scss)
- [Stylelint Tailwind](https://github.com/tailwindlabs/stylelint-config-tailwindcss)
- [CSS Property Order](https://css-tricks.com/poll-results-how-do-you-order-your-css-properties/)
