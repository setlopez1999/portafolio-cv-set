export type ProjectGroupId = 'design' | 'apps' | 'web' | 'games' | 'drawing'

export type PortfolioProject = {
  title: string
  subtitle: string
  description: string
  tech: string[]
  image?: string
  link?: string
  status?: string
}

export type ProjectGroup = {
  id: ProjectGroupId
  label: string
  kicker: string
  description: string
  accent: string
  techIcon: 'flutter' | 'vue' | 'java' | 'design' | 'pencil'
  projects: PortfolioProject[]
}

export const projectGroups: ProjectGroup[] = [
  {
    id: 'apps',
    label: 'Aplicaciones',
    kicker: 'Mobile / Android / APIs',
    description: 'Productos móviles pensados para resolver problemas concretos con arquitectura clara e integración de servicios.',
    accent: '#35f28a',
    techIcon: 'flutter',
    projects: [
      {
        title: 'MyNouts',
        subtitle: 'Aplicación de notas',
        description: 'Aplicación Flutter con arquitectura por capas, Riverpod y almacenamiento local offline-first.',
        tech: ['Flutter', 'Riverpod', 'Drift'],
        image: '/img/menouts.gif',
        link: 'https://github.com/setlopez1999/Reto-Mynouts',
        status: 'Proyecto personal',
      },
      {
        title: 'App Sonrisa Saludable',
        subtitle: 'Gestión odontológica',
        description: 'Aplicación Android para una clínica odontológica con Room, Retrofit y consumo de API REST.',
        tech: ['Java', 'Room', 'Retrofit'],
        image: '/img/odontologia.png',
        link: 'https://github.com/setlopez1999/AppMovil2025',
        status: 'Proyecto académico',
      },
      {
        title: 'Aplicación de conectividad',
        subtitle: 'Proyecto profesional · CD Latam',
        description: 'Aplicación Flutter en desarrollo con autenticación, APIs y verificación de conectividad Wi-Fi.',
        tech: ['Flutter', 'APIs', 'Auth'],
        status: 'En desarrollo',
      },
    ],
  },
  {
    id: 'web',
    label: 'Páginas web',
    kicker: 'Frontend / Web / CRM',
    description: 'Interfaces web y experiencias que conectan la presentación visual con los flujos reales del producto.',
    accent: '#bdfccf',
    techIcon: 'vue',
    projects: [
      {
        title: 'NexoPlay',
        subtitle: 'Landing page · CD Latam',
        description: 'Landing page en desarrollo, actualmente conectada con APIs y validada junto al equipo backend y el CRM.',
        tech: ['Frontend', 'APIs REST', 'CRM'],
        status: 'En desarrollo',
      },
      {
        title: 'SGA',
        subtitle: 'Sistema de gestión · CD Latam',
        description: 'Sistema profesional en el que participé en interfaces, integración de APIs y conexión con servicios backend.',
        tech: ['Flutter', 'APIs REST', 'Backend'],
        link: 'https://sga.cd-latam.com',
        status: 'En producción',
      },
      {
        title: 'Portafolio personal',
        subtitle: 'Vue / Nuxt / Vercel',
        description: 'Portafolio modular para presentar proyectos, experiencia y evolución profesional.',
        tech: ['Vue 3', 'Nuxt', 'GSAP'],
        link: 'https://github.com/setlopez1999/portafolio-cv-set',
        status: 'En evolución',
      },
    ],
  },
  {
    id: 'games',
    label: 'Juegos',
    kicker: 'Interacción / Lógica / 3D',
    description: 'Experimentos interactivos donde exploro reglas, movimiento, narrativa visual y diseño de experiencias.',
    accent: '#ffd27a',
    techIcon: 'java',
    projects: [
      {
        title: 'Juego 2D en Java',
        subtitle: 'Interactividad + POO',
        description: 'Juego de escritorio construido para practicar lógica, interacción y programación orientada a objetos.',
        tech: ['Java', 'Swing', 'POO'],
        image: '/img/juego.png',
        link: 'https://github.com/setlopez1999/LAB_09',
        status: 'Proyecto académico',
      },
    ],
  },
  {
    id: 'design',
    label: 'Diseño',
    kicker: 'Visual / Producto / Sistema',
    description: 'Ideas visuales, composiciones y decisiones de interfaz que acompañan el desarrollo técnico.',
    accent: '#9be7b1',
    techIcon: 'design',
    projects: [
      {
        title: 'Sistema visual del portafolio',
        subtitle: 'Diseño de interacción',
        description: 'Exploración de una identidad visual oscura, verde y cinematográfica para contar una historia profesional.',
        tech: ['UI', 'Motion', 'SVG'],
        status: 'En desarrollo',
      },
    ],
  },
  {
    id: 'drawing',
    label: 'Dibujo',
    kicker: 'Arte digital / Exploración',
    description: 'Una sección preparada para incorporar ilustraciones, estudios visuales y piezas futuras.',
    accent: '#d6a85d',
    techIcon: 'pencil',
    projects: [
      {
        title: 'Próximamente',
        subtitle: 'Estudios visuales',
        description: 'Este espacio crecerá con ilustraciones, bocetos y experimentos visuales.',
        tech: ['Dibujo', 'Composición'],
        status: 'Reservado',
      },
    ],
  },
]
