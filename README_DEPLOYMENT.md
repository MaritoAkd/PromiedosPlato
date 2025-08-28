# 🚀 Guía de Despliegue - Copa Libertadores de Plato

## Variables de Entorno Necesarias

Cuando subas a Render, agrega estas variables de entorno:

```
DATABASE_URL=postgresql://postgres:47503474Marito.@db.gczoccwzgbvedxgiloma.supabase.co:5432/postgres
NODE_ENV=production
PORT=10000
JWT_SECRET=copa-libertadores-secret-key-2024
```

## 📋 Pasos para Desplegar

### 1. Preparar Supabase
- ✅ Ya tienes la base de datos configurada
- URL: `db.gczoccwzgbvedxgiloma.supabase.co`

### 2. Subir a GitHub
1. Crea un repositorio nuevo en GitHub
2. Sube todos los archivos del proyecto (excepto `.env`)
3. Asegúrate de que `.gitignore` esté incluido

### 3. Configurar Render
1. Ve a https://render.com
2. Conecta tu repositorio de GitHub
3. Selecciona "Web Service"
4. Configuración:
   - **Build Command:** `npm install && npm run build && npm run db:push:force`
   - **Start Command:** `npm start`
   - **Node Version:** 18 o superior

### 4. Variables de Entorno en Render
En la sección "Environment Variables" agrega:
- `DATABASE_URL`: tu URL de Supabase completa
- `NODE_ENV`: `production`
- `PORT`: `10000`
- `JWT_SECRET`: `copa-libertadores-secret-key-2024`

### 5. Después del Despliegue
1. Ve a tu URL de Render + `/admin`
2. Usa las credenciales:
   - **Usuario:** MaritoAkd
   - **Contraseña:** 47503474Ma
3. Agrega equipos, países y partidos desde el panel

## 🔧 Comandos Importantes

```bash
# Instalar dependencias
npm install

# Desarrollar localmente
npm run dev

# Construir para producción
npm run build

# Migrar base de datos
npm run db:push:force

# Iniciar en producción
npm start
```

## 📝 Notas Importantes

- La aplicación ya está configurada para usar Supabase PostgreSQL
- Las tablas se crearán automáticamente en el primer despliegue
- El sistema de autenticación está configurado y funcional
- Todos los componentes están optimizados para producción

## 🛠️ Solución de Problemas

**Si el build falla:**
1. Verifica que todas las variables de entorno estén configuradas
2. Revisa los logs de build en Render
3. Asegúrate de que la URL de base de datos sea correcta

**Si no se crean las tablas:**
1. Ve a los logs de Render
2. Ejecuta manualmente: `npm run db:push:force`
3. Verifica la conexión a Supabase

## 📧 Credenciales de Admin
- **Usuario:** MaritoAkd  
- **Contraseña:** 47503474Ma