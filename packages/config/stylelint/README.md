# @repo/stylelint - Análisis de CSS/SCSS

Linter estático para CSS, SCSS y otros preprocesadores que analiza estilos para encontrar problemas, inconsistencias y violaciones de reglas.

## 🎯 ¿Qué hace?

- **Detecta errores** en CSS antes de que lleguen a producción
- **Mantiene consistencia** en todos los estilos
- **Mejora mantenibilidad** ordenando propiedades
- **Previene problemas** identificando propiedades ignoradas

## ⚙️ Configuraciones Disponibles

### 1. **baseConfig** - Configuración Base

```javascript
// .stylelintrc.js
import { baseConfig } from '@repo/stylelint_config';
export default baseConfig;
```

**Uso**: CSS puro, estilos básicos

### 2. **scssConfig** - Configuración SCSS

```javascript
import { scssConfig } from '@repo/stylelint_config';
export default scssConfig;
```

**Uso**: Archivos SCSS, preprocesadores

### 3. **tailwindConfig** - Configuración Tailwind

```javascript
import { tailwindConfig } from '@repo/stylelint_config';
export default tailwindConfig;
```

**Uso**: Proyectos con Tailwind CSS

## 🔧 Plugins Incluidos

- **Stylelint Order**: Ordenamiento automático de propiedades CSS
- **Stylelint Declaration Block No Ignored Properties**: Detectar propiedades ignoradas
- **Stylelint SCSS**: Reglas específicas para SCSS
- **Stylelint Tailwind CSS**: Reglas específicas para Tailwind CSS

## 🎯 Reglas Principales

### Ordenamiento de Propiedades CSS

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
  color: #ffffff;

  /* 6. Colores y fondos */
  background-color: #3b82f6;

  /* 7. Bordes y efectos */
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  /* 8. Transformaciones */
  transition: all 0.2s ease;

  /* 9. Interactividad */
  cursor: pointer;
}
```

### Detección de Propiedades Ignoradas

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
```

## 🚀 Comandos

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

## 📁 Estructura de Estilos Recomendada

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

## 🎨 Convenciones de Nomenclatura

### Clases CSS

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
```

### Variables SCSS

```scss
/* ✅ Variables de color */
$color-primary: #3b82f6;
$color-secondary: #64748b;

/* ✅ Variables de espaciado */
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;

/* ✅ Variables de tipografía */
$font-family-base: 'Inter', sans-serif;
$font-size-base: 16px;
$line-height-base: 1.5;
```

## 🔍 Troubleshooting

### Problemas Comunes

**1. Propiedades No Ordenadas**

```bash
bun run stylelint:fix
```

**2. Propiedades Ignoradas**

```css
/* ❌ Error: propiedades que no tienen efecto */
.element {
  display: block;
  width: auto; /* Eliminar esta línea */
}
```

**3. Verificar configuración**

```bash
npx stylelint --print-config src/styles.css
```

## 📚 Recursos

- [Documentación oficial de Stylelint](https://stylelint.io/)
- [Stylelint Order Plugin](https://github.com/hudochenkov/stylelint-order)
- [Stylelint SCSS](https://github.com/stylelint-scss/stylelint-scss)
- [Stylelint Tailwind](https://github.com/tailwindlabs/stylelint-config-tailwindcss)
