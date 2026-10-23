# TLS AI Tutor — demo en la nube

Prototipo independiente: lectura de texto con la voz del navegador y conversación hablada mediante OpenAI Realtime/WebRTC.

**No está integrado ni respaldado oficialmente por TLS.** No lo uses con estudiantes reales hasta que TLS apruebe seguridad, privacidad, autenticación y costos.

## Requisitos
- Cuenta de GitHub.
- Cuenta de OpenAI API con acceso a Realtime y facturación configurada.
- Cuenta de Render u otro alojamiento compatible.

No hace falta instalar software en tu computador.

## 1. Subir el proyecto a GitHub
1. Descarga el ZIP y en Windows haz clic derecho > **Extraer todo**.
2. Abre https://github.com/new, inicia sesión y crea un repositorio privado llamado `tls-ai-tutor-demo`.
3. Dentro del repositorio, pulsa **Add file > Upload files**.
4. Sube `package.json`, `server.mjs`, `.gitignore`, `README.md` y la carpeta `public` con `index.html`. Deben quedar en la raíz como se ven en el ZIP.
5. Pulsa **Commit changes**. Nunca subas una clave API.

## 2. Crear la clave API
1. Abre https://platform.openai.com/api-keys y crea una clave de proyecto.
2. Guárdala en privado. No la pegues en el HTML ni en GitHub.
3. Confirma que el proyecto API tiene acceso al modelo Realtime configurado y un método de facturación. El uso de API se cobra por separado de ChatGPT.

## 3. Publicar en Render
1. Abre https://render.com y crea una cuenta.
2. Pulsa **New > Web Service** y conecta tu repositorio.
3. Configura **Build Command**: `npm install`; **Start Command**: `npm start`.
4. En **Environment Variables**, crea:
   - `OPENAI_API_KEY` = tu clave API privada.
   - `DEMO_ACCESS_CODE` = código largo y aleatorio para quienes probarán la demo.
   - `OPENAI_REALTIME_MODEL` = `gpt-realtime-2.1` (si no está habilitado, cambia al modelo Realtime disponible en tu cuenta y en la documentación actual).
5. Pulsa **Create Web Service** y espera a que Render publique la URL.
6. Abre la URL HTTPS y añade `/health`; debería responder `{"ok":true}`.
7. Prueba lectura y conversación. Permite el acceso al micrófono.

El plan gratuito puede suspender servicios por inactividad. Revisa las condiciones actuales de Render y controla el uso de la API para evitar cargos inesperados.

## Problemas frecuentes
- **Falta OPENAI_API_KEY**: revisa las variables de Render y vuelve a desplegar.
- **Código incorrecto**: verifica `DEMO_ACCESS_CODE`, incluidos mayúsculas y espacios.
- **No conecta el audio**: confirma HTTPS, permiso de micrófono, acceso al modelo y facturación API.
- **Modelo no disponible**: configura el identificador Realtime disponible en tu proyecto.
- **La lectura no suena**: revisa volumen y voces del navegador; la lectura usa SpeechSynthesis y no la API.

## Antes de producción
El código compartido de acceso no sustituye autenticación institucional. El limitador en memoria es solo básico. Antes de usarlo con alumnos, TLS debe añadir inicio de sesión/SSO, límites por cuenta, protección contra abuso, controles de costos, revisión de privacidad/consentimiento, retención de datos definida y pruebas de seguridad. No solicites datos personales en la demo.

## Integrarlo en tls.edu.co
El administrador de TLS debe elegir:
- Enlace o botón desde el aula virtual a la URL del tutor (más sencillo).
- `iframe`, solo si la plataforma y sus políticas de seguridad lo permiten.
- Integración más profunda con autenticación institucional; requiere acceso autorizado al sistema del aula virtual.

No insertes el tutor en `tls.edu.co` sin cambios y aprobación del administrador.
