# Copa ETec Frontend

Frontend de la Copa ETec 2026 desarrollado con Next.js. Consume la API del proyecto hermano `copaetec-backend`.

## Requisitos

- Node.js 20 o superior
- `copaetec-backend` configurado con una base de datos Postgres
- Credenciales de Google OAuth para el inicio de sesión

## Configuración local

En el backend, crea `copaetec-backend/.env.local` a partir de `.env.example` y completa las variables necesarias, especialmente `DATABASE_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`.

En este frontend, copia `.env.example` como `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Los archivos `.env*` locales están excluidos de Git. No subas credenciales al repositorio.

## Ejecución

Inicia el backend en una terminal:

```bash
cd ../copaetec-backend
npm install
npm run dev
```

Inicia el frontend en otra terminal:

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

El backend corre en `http://localhost:4000` y el frontend en `http://localhost:3000`.

## Google OAuth

En Google Cloud Console, dentro de **APIs y servicios → Credenciales → ID de cliente OAuth 2.0**, agrega esta URI de redireccionamiento autorizada:

```text
http://localhost:4000/api/auth/callback/google
```

Si cambias el puerto del backend, actualiza también esta URI en Google Cloud y `NEXT_PUBLIC_API_URL`.

## Desarrollo

Puedes editar `app/page.tsx`; el servidor de desarrollo actualiza los cambios automáticamente.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
