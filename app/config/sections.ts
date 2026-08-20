export type StoryBlock = {
  id: string
  eyebrow: string
  title: string
  text: string
  media?: string
  mediaType?: 'image' | 'video' | 'svg'
  align: 'left' | 'right'
  accent: string
}

export const navigationItems = [
  { id: 'trayectoria', label: 'Trayectoria' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'logros', label: 'Logros' },
  { id: 'contacto', label: 'Contacto' },
]

export const journeyItems = [
  { date: '2024', title: 'Primeros productos', text: 'Exploración de desarrollo Android, APIs y soluciones orientadas a procesos reales.' },
  { date: '2025', title: 'Mobile y arquitectura', text: 'Construcción de aplicaciones con Flutter, React Native, Kotlin y arquitecturas offline-first.' },
  { date: '2026', title: 'Software Developer', text: 'Desarrollo profesional de productos web, mobile y Smart TV en CD Latam.' },
]

export const storyBlocks: StoryBlock[] = [
  {
    id: 'vision',
    eyebrow: '01 · Visión',
    title: 'Construir con intención',
    text: 'Me interesa crear soluciones que se entiendan, funcionen y puedan seguir creciendo. El código es importante, pero también lo es la experiencia que recibe la persona.',
    align: 'left',
    accent: '#35f28a',
  },
  {
    id: 'learning',
    eyebrow: '02 · Aprendizaje',
    title: 'Siempre hay otra capa por descubrir',
    text: 'Sigo fortaleciendo mis bases en desarrollo de software, diseño de videojuegos, cloud y nuevas herramientas que me permitan convertir ideas en productos.',
    align: 'right',
    accent: '#ffd27a',
  },
  {
    id: 'future',
    eyebrow: '03 · Próximo objetivo',
    title: 'Crecer de frontend a producto completo',
    text: 'Quiero seguir desarrollándome como Software Developer y Full-Stack Junior, participando en aplicaciones empresariales, CRM y productos digitales con impacto real.',
    align: 'left',
    accent: '#bdfccf',
  },
]

export const achievementItems = [
  { label: 'Experiencia', value: 'CD Latam', detail: 'Desarrollo de productos web, mobile y Smart TV.' },
  { label: 'Producción', value: 'SGA', detail: 'Sistema profesional actualmente desplegado.' },
  { label: 'Formación', value: 'AWS Academy', detail: 'Cloud Operations · 2025.' },
  { label: 'Stack', value: 'Mobile + Web', detail: 'Flutter, Kotlin, APIs y Vue/Nuxt.' },
]
