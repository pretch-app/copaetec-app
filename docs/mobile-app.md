# App para celular (Copa ETec 2026)

Dos formas de tener la Copa ETec como app en el celular:

| Plataforma | Forma | Qué necesita |
| --- | --- | --- |
| **Android** | App nativa (APK) con [Capacitor](https://capacitorjs.com/) | Este repo + toolchain de Android (ver abajo) |
| **iPhone / iPad** | PWA — "Agregar a pantalla de inicio" desde Safari | Nada extra; el sitio ya expone el manifest |
| iPhone (app real `.ipa`) | Proyecto iOS de Capacitor | Una Mac con Xcode + cuenta Apple Developer (USD 99/año) |

En todos los casos la interfaz y los datos son los del sitio en producción
(`https://copaetec.vercel.app`); la app no recompila Next.js ni guarda datos del torneo.

## iPhone / iPad (PWA)

El sitio incluye `app/manifest.ts` y metadata `appleWebApp` en `app/layout.tsx`, con íconos
en `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png` y
`app/apple-icon.png` (regenerables con `node scripts/make-pwa-icons.mjs`).

Instalación en el iPhone:

1. Abrir `https://copaetec.vercel.app` en **Safari** (no Chrome).
2. Botón **Compartir** → **Agregar a pantalla de inicio** → **Agregar**.
3. Queda con ícono propio, a pantalla completa y con su tarjeta en el selector de apps.

Requiere que el deploy de Vercel tenga estos cambios (push a `main` → deploy automático).

## Android (APK con Capacitor)

Se instala como aplicación real: ícono propio, entrada en el cajón de apps, sin barra de
navegador, splash screen.

## Qué agrega este repo

| Ruta | Para qué |
| --- | --- |
| `capacitor.config.ts` | ID de la app, URL del sitio, orígenes permitidos dentro de la app, user agent. |
| `mobile/www/index.html` | Página de "sin conexión" (fallback offline). |
| `assets/` | Íconos y splash de origen (1024 / 2732 px), generados desde `public/icon.svg`. |
| `scripts/make-app-icons.mjs` | Regenera `assets/` a partir del monograma. |
| `android/` | Proyecto nativo de Android que produce el APK. |

## Requisitos de build

- **JDK 21** (Capacitor 8 lo exige). Este equipo: `C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot`.
- **Android SDK** con `platform-tools`, `platforms;android-36`, `build-tools;36.0.0`.
  Este equipo: `%LOCALAPPDATA%\Android\Sdk`.

Variables de entorno (ya persistidas a nivel usuario en este equipo):

```
JAVA_HOME     = C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot
ANDROID_HOME  = %LOCALAPPDATA%\Android\Sdk
```

## Regenerar el proyecto nativo tras cambios de config

```bash
node scripts/make-app-icons.mjs           # solo si cambió el ícono
npx @capacitor/assets generate --android  # solo si cambió el ícono/splash
npx cap sync android                      # copia capacitor.config.ts + plugins
```

## Compilar el APK

### Debug (para instalar a mano, sin firma de release)

```bash
cd android
./gradlew.bat :app:assembleDebug
```

Salida: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release firmado (para distribuir o subir a Play Store)

1. Crear un keystore una sola vez (guardarlo fuera del repo):

   ```bash
   keytool -genkey -v -keystore copaetec-release.keystore -alias copaetec \
     -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Crear `android/keystore.properties` (ignorado por git):

   ```
   storeFile=../copaetec-release.keystore
   storePassword=...
   keyAlias=copaetec
   keyPassword=...
   ```

3. En `android/app/build.gradle`, agregar `signingConfigs` leyendo ese archivo y
   asignarlo a `buildTypes.release`.

4. Compilar:

   ```bash
   cd android
   ./gradlew.bat :app:assembleRelease   # APK
   ./gradlew.bat :app:bundleRelease     # AAB para Play Store
   ```

## Instalar el APK en el celular

1. Pasar el `.apk` al teléfono (cable, Drive, WhatsApp, etc.).
2. En Android: **Ajustes → Aplicaciones → Acceso especial → Instalar apps desconocidas**
   y permitir a la app desde la que se abre el archivo (Archivos, Chrome…).
3. Abrir el `.apk` y confirmar la instalación.
4. Con cable, alternativamente: `adb install -r app-debug.apk`.

## Notas

- **Login con Google**: el flujo ocurre dentro de la app. Se fuerza un user agent de
  Chrome (`capacitor.config.ts`) para que Google no rechace el WebView, y se habilitan
  cookies de terceros en `MainActivity.java` para que la cookie de sesión del backend
  (`copaetec-backend.vercel.app`) sea aceptada.
- **Dominio propio**: si el sitio pasa a un dominio propio, actualizar `SITE_URL` y
  `allowNavigation` en `capacitor.config.ts` y correr `npx cap sync android`.
- **Actualizaciones de la app**: como la UI se sirve desde el sitio, los cambios de
  contenido llegan sin recompilar. Solo hay que recompilar el APK si cambia la carcasa
  nativa (ícono, config, plugins, versión).
