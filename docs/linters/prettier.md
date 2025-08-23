# Prettier - Formateo de Código

## 🎯 ¿Qué es Prettier?

Prettier es un formateador de código automático que se enfoca en la consistencia visual del código. A diferencia de los linters que analizan la lógica, Prettier se centra únicamente en el formato y la presentación del código, aplicando reglas estrictas de formateo.

### Propósito Principal

- **🎨 Formateo automático**: Aplica un estilo consistente automáticamente
- **📏 Eliminar debates**: Una sola forma de formatear el código
- **🚀 Ahorrar tiempo**: No más discusiones sobre formato en code reviews
- **🔄 Integración perfecta**: Funciona con ESLint sin conflictos

## ⚙️ Configuración Actual

### Versión

- **Prettier**: 3.6.2
- **Configuración**: Centralizada en `.prettierrc`
- **Integración**: Con ESLint a través de `eslint-config-prettier`

### Estructura de Configuración

```
dutch/
├── .prettierrc              # Configuración principal
├── .prettierignore          # Archivos ignorados
└── packages/
    └── eslint_config/
        └── base.js          # Integración con ESLint
```

## 📋 Configuración y Reglas

### Configuración Principal

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "jsxSingleQuote": true,
  "proseWrap": "preserve"
}
```

### Explicación de Reglas

#### 1. **Punto y Coma (semi)**

```javascript
// ✅ Con punto y coma
const name = 'John';
const age = 30;

// ❌ Sin punto y coma
const name = 'John';
const age = 30;
```

#### 2. **Coma Final (trailingComma)**

```javascript
// ✅ Con coma final (ES5)
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

const colors = ['red', 'green', 'blue'];

// ❌ Sin coma final
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};
```

#### 3. **Comillas Simples (singleQuote)**

```javascript
// ✅ Comillas simples
const message = 'Hello World';
const template = `Hello ${name}`;

// ❌ Comillas dobles
const message = 'Hello World';
const template = `Hello ${name}`;
```

#### 4. **Ancho de Línea (printWidth)**

```javascript
// ✅ Líneas de máximo 80 caracteres
const longFunction = (param1, param2, param3, param4, param5, param6) => {
  return param1 + param2 + param3 + param4 + param5 + param6;
};

// ❌ Líneas muy largas
const longFunction = (
  param1,
  param2,
  param3,
  param4,
  param5,
  param6,
  param7,
  param8,
  param9,
  param10
) => {
  return (
    param1 +
    param2 +
    param3 +
    param4 +
    param5 +
    param6 +
    param7 +
    param8 +
    param9 +
    param10
  );
};
```

#### 5. **Indentación (tabWidth)**

```javascript
// ✅ 2 espacios de indentación
function example() {
  if (condition) {
    doSomething();
  }
}

// ❌ 4 espacios o tabs
function example() {
  if (condition) {
    doSomething();
  }
}
```

#### 6. **Espacios en Llaves (bracketSpacing)**

```javascript
// ✅ Con espacios
const obj = { name: 'John', age: 30 };
const arr = [1, 2, 3];

// ❌ Sin espacios
const obj = { name: 'John', age: 30 };
const arr = [1, 2, 3];
```

#### 7. **Llaves de JSX (bracketSameLine)**

```javascript
// ✅ Llaves en línea separada
<Button
  onClick={handleClick}
  disabled={isLoading}
>
  Click me
</Button>

// ❌ Llaves en la misma línea
<Button
  onClick={handleClick}
  disabled={isLoading}>
  Click me
</Button>
```

#### 8. **Paréntesis en Arrow Functions (arrowParens)**

```javascript
// ✅ Siempre con paréntesis
const singleParam = param => param * 2;
const multipleParams = (param1, param2) => param1 + param2;

// ❌ Sin paréntesis cuando es posible
const singleParam = param => param * 2;
const multipleParams = (param1, param2) => param1 + param2;
```

## 🎨 Ejemplos de Formateo

### JavaScript/TypeScript

**Antes del formateo**:

```javascript
const user = { name: 'John', age: 30, email: 'john@example.com' };
const colors = ['red', 'green', 'blue'];
function greet(name) {
  return `Hello ${name}`;
}
const numbers = [1, 2, 3, 4, 5].map(n => n * 2).filter(n => n > 5);
```

**Después del formateo**:

```javascript
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

const colors = ['red', 'green', 'blue'];

function greet(name) {
  return `Hello ${name}`;
}

const numbers = [1, 2, 3, 4, 5].map(n => n * 2).filter(n => n > 5);
```

### JSX/TSX

**Antes del formateo**:

```jsx
const UserCard = ({ user, onClick }) => {
  return (
    <div className='user-card' onClick={onClick}>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};
```

**Después del formateo**:

```jsx
const UserCard = ({ user, onClick }) => {
  return (
    <div className='user-card' onClick={onClick}>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};
```

### CSS/SCSS

**Antes del formateo**:

```css
.button {
  background: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.button:hover {
  background: darkblue;
}
```

**Después del formateo**:

```css
.button {
  background: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.button:hover {
  background: darkblue;
}
```

### JSON

**Antes del formateo**:

```json
{
  "name": "John",
  "age": 30,
  "email": "john@example.com",
  "address": { "street": "123 Main St", "city": "New York", "zip": "10001" }
}
```

**Después del formateo**:

```json
{
  "name": "John",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  }
}
```

## 🚀 Uso y Comandos

### Comandos Principales

```bash
# Formatear todo el proyecto
bun run prettier

# Formatear con corrección automática
bun run prettier:fix

# Formatear archivos específicos
npx prettier --write "src/**/*.{js,jsx,ts,tsx}"

# Verificar formato sin cambiar archivos
npx prettier --check "src/**/*.{js,jsx,ts,tsx}"

# Formatear un archivo específico
npx prettier --write src/components/Button.tsx
```

### Integración con VS Code

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Configuración de Archivos Ignorados

```gitignore
# .prettierignore
node_modules/
dist/
build/
.next/
coverage/
*.min.js
*.min.css
package-lock.json
yarn.lock
pnpm-lock.yaml
bun.lock
```

## 🔧 Integración con ESLint

### Configuración de Integración

```javascript
// packages/eslint_config/base.js
import eslintConfigPrettier from 'eslint-config-prettier';

export const baseConfig = [
  // ... otras configuraciones
  eslintConfigPrettier, // Debe estar al final
];
```

### Beneficios de la Integración

- ✅ **Sin conflictos**: ESLint y Prettier no se pelean
- ✅ **Workflow optimizado**: ESLint analiza lógica, Prettier formatea
- ✅ **Configuración consistente**: Mismas reglas en todo el proyecto

## 📁 Tipos de Archivo Soportados

### JavaScript/TypeScript

- `.js`, `.jsx`, `.ts`, `.tsx`
- `.mjs`, `.cjs`
- Configuraciones de ESLint

### Estilos

- `.css`, `.scss`, `.sass`
- `.less`
- Archivos de configuración de PostCSS

### Datos y Configuración

- `.json`, `.jsonc`
- `.yaml`, `.yml`
- `.md`, `.mdx`
- `.html`, `.vue`

### Otros

- `.graphql`
- `.gql`
- Archivos de configuración de varios frameworks

## 🔍 Troubleshooting

### Problemas Comunes

#### 1. Conflictos con ESLint

**Síntoma**: ESLint y Prettier se pelean por el formato
**Solución**: Verificar que `eslint-config-prettier` esté incluido al final

#### 2. Archivos No Formateados

**Síntoma**: Algunos archivos no se formatean automáticamente
**Solución**: Verificar `.prettierignore` y extensiones de archivo

#### 3. Configuración No Aplicada

**Síntoma**: Prettier no usa la configuración del proyecto
**Solución**: Verificar que `.prettierrc` esté en la raíz del proyecto

### Comandos de Diagnóstico

```bash
# Ver configuración aplicada
npx prettier --find-config-path src/index.ts

# Ver configuración completa
npx prettier --print-config src/index.ts

# Debug de configuración
npx prettier --debug-check src/
```

## 📚 Recursos Adicionales

- [Documentación oficial de Prettier](https://prettier.io/)
- [Playground de Prettier](https://prettier.io/playground/)
- [Integración con ESLint](https://prettier.io/docs/en/integrating-with-linters.html)
- [Configuración de Prettier](https://prettier.io/docs/en/configuration.html)
- [Reglas de formateo](https://prettier.io/docs/en/options.html)
