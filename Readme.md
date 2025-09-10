Flota365 - Sistema de Gestión de Flotas

Flota365 es una plataforma web integral para la gestión y monitoreo de flotas de vehículos, desarrollada con Vue.js. Permite administrar vehículos, conductores, flotas, generar reportes, monitoreo en tiempo real y análisis predictivo con IA.


✨ Características

Dashboard Centralizado: Visualización de KPIs y alertas importantes
Gestión de Vehículos: Administración completa de la información de vehículos
Gestión de Conductores: Seguimiento de licencias, desempeño y asignaciones
Gestión de Flotas: Organización de vehículos en flotas para mejor administración
Monitoreo en Tiempo Real: Visualización de ubicación y estado de vehículos
Reportes Personalizados: Generación de reportes de rendimiento, consumo y más
Análisis Predictivo: Predicción de mantenimientos y optimización mediante IA
Diseño Responsivo: Adaptable a diferentes dispositivos

🛠️ Tecnologías

Frontend: Vue.js 2, Vue Router, Vuex
Simulación de Backend: Mock API con adaptadores
Estilos: CSS personalizado
Iconos: Font Awesome
Despliegue: Firebase Hosting

📁 Estructura del Proyecto
flota365-vue/
├── public/                # Archivos estáticos
├── src/
│   ├── assets/            # CSS, imágenes y recursos
│   ├── components/        # Componentes Vue reutilizables
│   ├── data/              # JSONs para simular datos de API
│   ├── router/            # Configuración de rutas
│   ├── services/          # Servicios para comunicación con API
│   ├── store/             # Gestión de estado con Vuex
│   ├── views/             # Componentes de vista principales
│   ├── App.vue            # Componente raíz
│   └── main.js            # Punto de entrada
├── .eslintrc.js           # Configuración ESLint
├── babel.config.js        # Configuración Babel
├── firebase.json          # Configuración Firebase
├── package.json           # Dependencias del proyecto
└── vue.config.js          # Configuración de Vue CLI
🚀 Instalación y Configuración
Prerrequisitos

Node.js (v12 o superior)
npm (v6 o superior)

Instalación

Clonar el repositorio:
git clone https://1ASI0730-2510-4370-G3-Flota365/frontend-flota365.git
cd frontend-flota365

Instalar dependencias:
npm install

Ejecutar en desarrollo:
npm run serve


La aplicación estará disponible en http://localhost:8080 (o el puerto que se muestre en la consola).
💻 Uso
Desarrollo
bash# Iniciar servidor de desarrollo
npm run serve

# Compilar para producción
npm run build

# Ejecutar linter
npm run lint
Usuarios Demo

Usuario: admin@flota365.com
Contraseña: demo123

🔥 Despliegue en Firebase

Instalar Firebase CLI globalmente:
npm install -g firebase-tools

Iniciar sesión en Firebase:
firebase login

Inicializar Firebase en el proyecto:
firebase init
Selecciona "Hosting" y sigue las instrucciones.
Construir para producción:
npm run build

Desplegar:
firebase deploy


🧩 Simulación de Backend
El proyecto utiliza adaptadores mock para simular un backend:

Los datos están en /src/data/ como archivos JSON
La simulación de API se gestiona a través de /src/services/mockAdapter.js
Para integrar con un backend real, modificar /src/services/api.js

📋 Roadmap

 Sistema de autenticación real
 Integración con mapas (Google Maps, Mapbox)
 Módulo de planificación de rutas
 Implementación PWA
 Soporte para múltiples idiomas
 Integración con dispositivos GPS/OBD

👥 Contribución

Fork el proyecto
Crea una rama para tu feature (git checkout -b feature/amazing-feature)
Commit tus cambios (git commit -m 'Add: Amazing Feature')
Push a la rama (git push origin feature/amazing-feature)
Abre un Pull Request

📄 Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
📞 Contacto
Nombre del Responsable - @tu_twitter - email@ejemplo.com
URL del Proyecto: https://1ASI0730-2510-4370-G3-Flota365/frontend-flota365

© 2025 Flota365 - VSC-Visionaries