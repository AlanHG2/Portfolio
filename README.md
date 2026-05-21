# Alan Garcia — Portfolio

Portfolio personal de Alan Garcia, Licenciado en Ciencias Computacionales. Sitio estático de alto rendimiento construido con Astro 6 y desplegado en Cloudflare Pages, con un formulario de contacto serverless protegido por Turnstile.

## ✨ Características

- **Rendimiento extremo** — Arquitectura MPA con zero JS por defecto; el JS se carga solo donde hace falta (Islands Architecture).
- **Diseño con tema claro/oscuro** — Preferencia persiste en `localStorage`; por defecto dark mode.
- **Animaciones scroll-reveal** — Reveal suave de secciones (fade, left, right, stagger) usando `IntersectionObserver`.
- **Glitch effect en el hero** — Tipografía animada con CSS puro.
- **Formulario de contacto con validación** — React Hook Form + Zod; envío via Cloudflare Function + Resend.
- **Bot protection** — Cloudflare Turnstile integrado en el formulario.
- **Descarga de CV** — Enlace directo al PDF desde el hero.
- **Linting estricto** — Biome con hook de pre-commit via Husky.

---

## 🛠️ Tech Stack

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | [Astro 6](https://astro.build/) |
| **UI / Componentes** | React 19, shadcn/ui, Base UI |
| **Estilos** | Tailwind CSS v4, tw-animate-css |
| **Tipografías** | Oxanium Variable, Figtree Variable (Fontsource) |
| **3D / Gradientes** | Three.js, @react-three/fiber, @shadergradient/react |
| **Forms** | React Hook Form v7, Zod v4 |
| **Bot protection** | Cloudflare Turnstile (@marsidev/react-turnstile) |
| **Email** | Resend API |
| **Adapter / Deploy** | @astrojs/cloudflare → Cloudflare Pages |
| **Linter** | Biome 2 |
| **Package manager** | pnpm |
| **Node requerido** | ≥ 22.12.0 |

---

## 📁 Estructura del Proyecto

```
.
├── functions/
│   └── api/
│       └── send.ts          # Cloudflare Function — endpoint POST /api/send
├── public/
│   └── CV-AlanGarcía.pdf    # CV descargable
├── src/
│   ├── assets/              # Imágenes de proyectos (optimizadas con <Image />)
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Hero/        # HeroSection.astro + hero.css
│   │   │   ├── About/       # About.astro + about.css
│   │   │   ├── Contact/     # Contact.astro, ContactForm.tsx, ContactModal.tsx
│   │   │   │               #   schema.ts, useContactForm.ts, contact.css
│   │   │   └── ProjectsSection.astro
│   │   ├── layout/          # Header, Footer y navegación
│   │   └── ui/              # Componentes reutilizables (SectionTitle, FeatureBlock, …)
│   ├── layouts/
│   │   └── MainLayout.astro # Shell principal con SEO meta tags
│   ├── lib/                 # Utilidades (cn, etc.)
│   ├── pages/
│   │   └── index.astro      # Única página: Hero → Projects → About → Contact
│   └── styles/
│       └── global.css       # Design tokens, utilidades globales
├── astro.config.mjs
├── biome.json
├── components.json          # Configuración shadcn
├── tsconfig.json
└── wrangler.jsonc           # Configuración Cloudflare Workers / Pages
```

---

## 🚀 Primeros Pasos

### Requisitos previos

- **Node.js** ≥ 22.12.0
- **pnpm** (se recomienda v10+)

```bash
npm install -g pnpm
```

### 1. Clonar el repositorio

```bash
git clone https://github.com/AlanHG2/Portfolio.git
cd Portfolio
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env   # o crea el archivo manualmente
```

Edita `.env` con tus valores (ver sección [Variables de Entorno](#-variables-de-entorno)):

```env
PUBLIC_TURNSTILE_SITE_KEY=<tu_site_key>
TURNSTILE_SECRET_KEY=<tu_secret_key>
RESEND_API_KEY=<tu_api_key>
TO_EMAIL=tu@email.com
```

### 4. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

Abre [http://localhost:4321](http://localhost:4321) en el navegador.

> **Nota:** El formulario de contacto llama a `/api/send`. En desarrollo local con `astro dev`, esta ruta **no** ejecuta la Cloudflare Function. Usa `pnpm wrangler pages dev ./dist` para probarla localmente (requiere hacer `pnpm build` antes).

---

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia el servidor de desarrollo Astro en `localhost:4321` |
| `pnpm build` | Genera el bundle de producción en `./dist` |
| `pnpm preview` | Previsualiza el build de producción |
| `pnpm lint` | Ejecuta Biome en modo check (sin modificar archivos) |
| `pnpm lint:fix` | Ejecuta Biome y aplica fixes automáticos |
| `pnpm generate-types` | Genera los tipos de Cloudflare con Wrangler |

---

## 🔑 Variables de Entorno

### Requeridas en producción

| Variable | Descripción | Cómo obtenerla |
|----------|-------------|----------------|
| `PUBLIC_TURNSTILE_SITE_KEY` | Site key pública de Cloudflare Turnstile | [Cloudflare Dashboard → Turnstile](https://dash.cloudflare.com/) |
| `TURNSTILE_SECRET_KEY` | Secret key de Cloudflare Turnstile (usada server-side) | Cloudflare Dashboard → Turnstile |
| `RESEND_API_KEY` | API key de Resend para enviar emails | [resend.com](https://resend.com) |
| `TO_EMAIL` | Dirección de destino para los mensajes del formulario | Tu email personal |

### Valores de testing (desarrollo)

Turnstile ofrece claves de prueba que siempre aprueban:

```env
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x00000000000000000000000000000000
```

Si `RESEND_API_KEY` no está definida, el endpoint `/api/send` simulará un envío exitoso (útil en desarrollo).

### Configurar en Cloudflare Pages

1. Ve a **Cloudflare Dashboard → Pages → tu proyecto → Settings → Environment variables**.
2. Añade cada variable en el entorno `Production` (y `Preview` si deseas).
3. Las variables `PUBLIC_*` son visibles en el cliente; el resto son solo server-side.

---

## ☁️ Despliegue en Cloudflare Pages

Este proyecto usa el adaptador `@astrojs/cloudflare`, por lo que genera un Worker de Cloudflare junto con los assets estáticos.

### Primera vez (CLI)

```bash
# Autenticarse con Wrangler
pnpm wrangler login

# Build + deploy
pnpm build
pnpm wrangler pages deploy ./dist
```

### Deploy continuo (recomendado)

1. Conecta el repositorio en **Cloudflare Dashboard → Pages → Create a project**.
2. Configura:
   - **Build command:** `pnpm build`
   - **Build output directory:** `dist`
   - **Node.js version:** `22`
3. Agrega las variables de entorno en el dashboard.
4. Cada push a `main` disparará un deploy automático.

### Probar la función de email localmente

```bash
pnpm build
pnpm wrangler pages dev ./dist
```

Esto levanta un entorno local idéntico a Cloudflare Pages en `http://localhost:8788`.

---

## 📬 API — Formulario de Contacto

### `POST /api/send`

Endpoint implementado como Cloudflare Function en `functions/api/send.ts`.

**Body (JSON):**

```json
{
  "nombre": "string (requerido, 3–50 chars)",
  "email": "string (requerido, email válido)",
  "telefono": "string (requerido, exactamente 10 dígitos)",
  "mensaje": "string (requerido, 10–150 chars)",
  "token": "string (requerido, Turnstile challenge token)"
}
```

**Flujo interno:**

1. Valida campos obligatorios.
2. Verifica el token con la API de Cloudflare Turnstile.
3. Envía el email a `TO_EMAIL` vía Resend API.

**Respuestas:**

| Status | Descripción |
|--------|-------------|
| `200` | Email enviado correctamente |
| `400` | Campos faltantes o Turnstile inválido |
| `500` | Error al enviar con Resend |

---

## 🧩 Secciones del Sitio

### Hero
Presentación con nombre en glitch-effect (CSS), badges de disponibilidad/ubicación/idiomas, y links a GitHub, LinkedIn y descarga del CV.

### Proyectos
Tres proyectos destacados con imagen, descripción, badges de tecnología y métricas clave:
- **CLEMPS** — Plataforma de consulta serverless (Astro, Netlify, Google Apps Script).
- **BlissDDM** — Librería de componentes y design system (React, Tailwind, Storybook).
- **Majo Exterior Remodeling** — Web corporativa con 100% Core Web Vitals (Astro, React, Google Cloud).

### Sobre Mí
Bloque de texto con descripción profesional, lista de habilidades y tecnologías con animaciones stagger.

### Contacto
Modal con formulario validado (React Hook Form + Zod) y protección anti-bot (Turnstile). Al enviarse, muestra confetti de éxito.

---

## 🐛 Troubleshooting

### El formulario de contacto no envía

- Verifica que `PUBLIC_TURNSTILE_SITE_KEY` y `TURNSTILE_SECRET_KEY` estén configuradas correctamente.
- En local sin Wrangler, el endpoint `/api/send` no existe; usa las claves de test de Turnstile y prueba con `pnpm wrangler pages dev`.

### Error `Command "biome" not found`

Las dependencias no están instaladas. Ejecuta:

```bash
pnpm install
```

### El build falla con errores de tipos

Regenera los tipos de Cloudflare:

```bash
pnpm generate-types
```

Luego revisa `src/env.d.ts` y que `tsconfig.json` incluya los paths correctos.

### Las fuentes no cargan

Asegúrate de que los paquetes de Fontsource están instalados (`pnpm install`) y que se importan en el frontmatter de `index.astro`:

```js
import "@fontsource-variable/oxanium";
import "@fontsource-variable/figtree";
```

---

## 📄 Licencia

Este proyecto es de uso personal. Todo el código fuente puede consultarse con fines educativos.

---

<p align="center">Hecho con ☕ y mucho TypeScript · Alan Garcia · Hidalgo, México</p>