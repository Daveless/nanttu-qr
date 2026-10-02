# nanttu-qr

Página estática que muestra la contraseña WiFi del estudio. QR fijo apunta aquí.

## Flujo

1. Make corre cada 2 semanas (lunes 06:00).
2. Genera password random, agrega fila al Google Sheet.
3. Actualiza `wifi.json` en este repo (commit vía módulo GitHub).
4. Envía email para cambiar la contraseña del router.
5. GitHub Pages redeploya y la página muestra la nueva clave.

## Archivos

- `index.html` — UI
- `wifi.js` — fetch + render + botones copiar/conectar
- `wifi.json` — fuente de datos (SSID, password, semana)
