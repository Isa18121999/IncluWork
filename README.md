# Inklu

Plataforma móvil de empleo inclusivo para personas con discapacidad verificadas y empresas comprometidas con la inclusión laboral.

## MVP

- Registro y autenticación por roles.
- Verificación de acreditación de discapacidad.
- Perfiles de candidatos y empresas.
- Ofertas laborales, matching y postulaciones.
- Carga de CV en PDF, DOC o DOCX.

## Despliegue

La API y el cliente se despliegan de forma independiente. Antes de publicar, configura las variables de entorno de cada servicio a partir de los archivos de ejemplo; los archivos `.env` no se versionan.

### API (Node.js + MongoDB)

1. Crea una base MongoDB y configura `MONGODB_URI` en el proveedor de hosting.
2. Configura `CORS_ORIGIN` con la URL pública del cliente web, si corresponde. Puede ser una lista separada por comas.
3. Despliega el directorio `backend` con Node.js 20 o superior. El proceso de inicio es `npm start`; el proveedor debe asignar `PORT`.
4. Comprueba la disponibilidad en `GET /health`. Una respuesta satisfactoria es `{ "status": "ok", "database": "connected" }`.

Para desarrollo local también puedes iniciar MongoDB y la API juntos:

```bash
docker compose up --build
```

Esto crea un volumen persistente llamado `mongo_data`. Antes de desplegar, reemplaza `JWT_SECRET` por un valor largo y aleatorio; nunca uses el valor de ejemplo en producción.

También se incluye un contenedor para hosts compatibles con Docker:

```bash
docker build -t inklu-api ./backend
docker run --rm -p 3000:3000 --env-file backend/.env inklu-api
```

> Los CV se guardan en `backend/uploads`. El servidor elimina el archivo local previo al reemplazarlo. Para producción usa un volumen persistente o sustituye el almacenamiento local por un servicio de objetos antes de escalar a múltiples réplicas.

### Aplicación Expo

1. Copia `mobile/.env.example` a `mobile/.env`.
2. Define `EXPO_PUBLIC_API_URL` con la URL **HTTPS** pública de la API, sin `/api` ni barra final.
3. Instala dependencias y ejecuta el cliente:

```bash
cd mobile
npm ci
npm run start
```

Para generar el bundle web listo para publicar:

```bash
cd mobile
npx expo export --platform web
```

El resultado se crea en `mobile/dist` y puede alojarse en cualquier hosting estático. Para Android e iOS, usa el mismo valor de `EXPO_PUBLIC_API_URL` durante la compilación con Expo/EAS.

## Desarrollo local

```bash
cp backend/.env.example backend/.env
cp mobile/.env.example mobile/.env
cd backend && npm ci && npm run dev
```

En otra terminal, ejecuta `cd mobile && npm ci && npm run start`. Para usar un dispositivo físico, sustituye `localhost` en `mobile/.env` por la IP accesible de tu equipo.

## Seguridad y verificación

- La API usa tokens JWT: todas las operaciones que alteran perfiles, ofertas, postulaciones o CV requieren `Authorization: Bearer <token>`.
- Las empresas solo pueden gestionar sus propias ofertas y postulaciones; los candidatos solo pueden postularse y actualizar su propio CV.
- Ejecuta las comprobaciones del backend con `cd backend && npm run check && npm test`.
