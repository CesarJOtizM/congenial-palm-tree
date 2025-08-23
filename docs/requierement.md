# 📋 Requerimiento Técnico – Prueba Desarrollador Full Stack

## 📝 Contexto
Se debe construir una aplicación para **gestionar deudas entre amigos**. Cada usuario puede:
- Registrar deudas.
- Pagarlas.
- Consultar su estado.

El objetivo es entregar un **MVP funcional** que cumpla los criterios técnicos establecidos.

---

## ⚙️ Fase 1 – Reto Técnico

### 🔹 Backend (C# / Node.js con TypeScript)
Crear una **API REST** (o **GraphQL**) que permita:
1. **Usuarios**
   - Registro de usuarios (email y contraseña encriptada).
2. **Deudas**
   - Crear deuda.
   - Consultar deuda.
   - Editar deuda.
   - Eliminar deuda.
   - Marcar deuda como **pagada**.
   - Listar las deudas de un usuario (pendientes y pagadas).

#### 📦 Persistencia
- Base de datos: **PostgreSQL** (usuarios y deudas).
- Capa de caché: **DynamoDB (AWS)** o **Redis** (puede ser simulado si no se tiene AWS).

#### ✅ Validaciones obligatorias
- No se pueden registrar deudas con valores negativos.
- Una deuda pagada **no puede ser modificada**.

#### ⭐ Extras (opcional)
- Endpoint para exportar deudas en **JSON** o **CSV**.
- Endpoint con agregaciones (ej: total de deudas pagadas, saldo pendiente).
- Pruebas unitarias.

---

### 🔹 Frontend (React con TS / Angular)
Debe incluir:
1. **Pantalla de Login/Registro.**
2. **Pantalla de listado de deudas** con filtros (pendientes/pagadas).
3. **Formulario** para crear una nueva deuda.
4. **Vista de detalle** de una deuda.
5. UI moderna, minimalista y responsiva.
   - *No se evalúa diseño perfecto, sino organización y buenas prácticas.*

---

### 🔹 Restricciones y Retos
- El código debe estar en **GitHub/GitLab**, con commits progresivos (no todo en uno solo).
- Incluir un **README** con:
  - Instrucciones de despliegue local.
  - Breve explicación de decisiones técnicas.
- Se evaluará:
  - Organización del repositorio.
  - Estructura de carpetas.
  - Convenciones de código.
  - Claridad de la documentación.

---

## 🏗️ Fase 2 – Preguntas de Arquitectura y Experiencia

1. **Microservicios:**
   - Cómo dividirías los servicios si el sistema pasa de monolito a microservicios.
   - Qué consideraciones de comunicación implementarías.

2. **Optimización en la nube (AWS):**
   - Servicios a usar para:
     - Autenticación segura.
     - Base de datos.
     - Cache y escalabilidad.
     - Balanceo de carga.

3. **Buenas prácticas de seguridad:**
   - Al menos 3 prácticas clave en:
     - Backend.
     - Frontend.
     - Despliegue en la nube.

4. **PostgreSQL vs NoSQL:**
   - En qué escenarios usarías cada uno, con ejemplos concretos.

5. **Despliegue:**
   - Diseñar un pipeline **CI/CD** que asegure calidad, testeo y despliegue continuo.

---

## 📦 Entregables
1. **Repositorio en GitHub/GitLab** con el código.
2. **README** con:
   - Instrucciones claras de instalación y ejecución.
   - Respuestas a las preguntas de arquitectura (puede ser en el mismo archivo).

📧 **Entrega por correo:** `welcome@doublevpartners.com`
📌 **Asunto:** `Prueba Técnica + [Tu nombre]`

---
