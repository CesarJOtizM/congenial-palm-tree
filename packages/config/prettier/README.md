# @repo/prettier - Formateo de Código

Formateador de código opinado que automáticamente formatea JavaScript, TypeScript, CSS, SCSS, HTML, JSON y otros lenguajes.

## 🎯 ¿Qué hace?

- **Formateo automático** con estilo consistente
- **Velocidad** sin afectar funcionalidad
- **Consistencia** para todo el equipo

## ⚙️ Configuraciones Disponibles

### 1. **baseConfig** - Configuración Base

```javascript
// .prettierrc.js
const { baseConfig } = require('@repo/config/prettier');
module.exports = baseConfig;
```

**Uso**: JavaScript, TypeScript, CSS, SCSS, HTML, JSON

### 2. **astroConfig** - Configuración Astro

```javascript
const { astroConfig } = require('@repo/config/prettier');
module.exports = astroConfig;
```

**Uso**: Archivos Astro (.astro)

### 3. **reactConfig** - Configuración React

```javascript
const { reactConfig } = require('@repo/config/prettier');
module.exports = reactConfig;
```

**Uso**: Archivos React/JSX

## 📋 Configuración Base

```javascript
module.exports = {
  semi: true, // Punto y coma al final
  trailingComma: 'es5', // Comas finales
  singleQuote: true, // Comillas simples
  jsxSingleQuote: true, // Comillas simples en JSX
  printWidth: 80, // Ancho máximo de línea
  tabWidth: 2, // 2 espacios de indentación
  useTabs: false, // Usar espacios, no tabs
  bracketSpacing: true, // Espacios en llaves
  bracketSameLine: false, // Llaves de cierre en nueva línea
  arrowParens: 'avoid', // Paréntesis en arrow functions solo si es necesario
  endOfLine: 'lf', // Finales de línea Unix
  quoteProps: 'as-needed', // Comillas en propiedades solo si es necesario
  proseWrap: 'preserve', // Preservar saltos de línea en texto
};
```

## 📝 Ejemplos de Formateo

### JavaScript/TypeScript

```javascript
// ❌ Antes
const user = { name: 'John', email: 'john@example.com' };
function greet(user) {
  return `Hello, ${user.name}!`;
}

// ✅ Después
const user = {
  name: 'John',
  email: 'john@example.com',
};

function greet(user) {
  return `Hello, ${user.name}!`;
}
```

### JSX/TSX

```jsx
// ❌ Antes
function UserCard({ user, onClick }) {
  return (
    <div className='user-card' onClick={onClick}>
      <h2>{user.name}</h2>
    </div>
  );
}

// ✅ Después
function UserCard({ user, onClick }) {
  return (
    <div className='user-card' onClick={onClick}>
      <h2>{user.name}</h2>
    </div>
  );
}
```

### Astro

```astro
---
// ❌ Antes
const {title,description}=Astro.props;
const user=await getUser();
---

<html lang="en">
<head><title>{title}</title></head>
<body><h1>Welcome, {user.name}!</h1></body>
</html>

---
// ✅ Después
const { title, description } = Astro.props;
const user = await getUser();
---

<html lang='en'>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <h1>Welcome, {user.name}!</h1>
  </body>
</html>
```

## 🚀 Comandos

```bash
# Formatear todos los archivos
bun run prettier

# Formatear con corrección automática
bun run prettier:fix

# Formatear archivos específicos
npx prettier --write "src/**/*.{js,ts,jsx,tsx,css,scss}"

# Verificar formato sin cambiar
npx prettier --check "src/**/*.{js,ts,jsx,tsx,css,scss}"
```

## 🔧 Integración VS Code

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "prettier.requireConfig": true
}
```

## 📁 Archivos Ignorados

```javascript
// .prettierignore
node_modules/
dist/
build/
.next/
coverage/
*.min.js
*.min.css
.env*
```

## 🔍 Troubleshooting

### Problemas Comunes

**1. Conflictos con ESLint**

```bash
npm install --save-dev eslint-config-prettier
```

**2. Verificar configuración**

```bash
npx prettier --print-config src/components/Button.tsx
```

**3. Debug**

```bash
npx prettier --debug-check src/components/Button.tsx
```

## 📚 Recursos

- [Documentación oficial](https://prettier.io/)
- [Prettier Playground](https://prettier.io/playground/)
- [Plugin Astro](https://github.com/withastro/prettier-plugin-astro)
