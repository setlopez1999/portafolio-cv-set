# Lista de control de calidad

Usar esta lista antes de entregar una habilidad nueva o una actualización.

## Identidad y activación

- [ ] El nombre es descriptivo, estable, corto y está en minúsculas con guiones.
- [ ] La descripción indica qué hace la habilidad.
- [ ] La descripción indica cuándo usarla.
- [ ] La descripción no depende de una conversación previa.
- [ ] La habilidad no se activa para tareas que no le corresponden.

## Flujo

- [ ] El objetivo está definido en una frase.
- [ ] Las entradas obligatorias están enumeradas.
- [ ] Los pasos aparecen en un orden ejecutable.
- [ ] Las decisiones condicionales están expresadas de forma explícita.
- [ ] Las preguntas al usuario están limitadas a datos realmente necesarios.
- [ ] Los supuestos se declaran y pueden corregirse.
- [ ] Los errores y casos límite tienen una respuesta.

## Recursos

- [ ] `SKILL.md` contiene el núcleo y no una enciclopedia.
- [ ] Las referencias largas están en `references/`.
- [ ] Las plantillas reutilizables están en `templates/`.
- [ ] Los scripts se reservan para tareas deterministas o repetitivas.
- [ ] Cada ruta enlazada existe.
- [ ] No se repite el mismo contenido en varios archivos.
- [ ] No existen archivos de ejemplo o carpetas sin uso.

## Salida

- [ ] El formato de salida está definido.
- [ ] Las secciones o campos obligatorios están indicados.
- [ ] Hay al menos un ejemplo si el estilo es importante.
- [ ] La salida puede adaptarse cuando el contexto lo requiera.
- [ ] Se incluyen fuentes o evidencias cuando la tarea las necesita.
- [ ] Se omiten datos no confirmados, secretos o información sensible.

## Portabilidad

- [ ] La lógica principal está expresada en Markdown claro.
- [ ] No se requieren rutas privadas ni nombres internos.
- [ ] Se distinguen instrucciones universales de pasos específicos de una plataforma.
- [ ] Las dependencias externas están enumeradas.
- [ ] Existe una nota de adaptación para plataformas que no soporten frontmatter, scripts o carpetas auxiliares.

## Validación práctica

- [ ] Se probó con un caso normal.
- [ ] Se probó con entradas incompletas.
- [ ] Se probó con una solicitud parecida pero fuera de alcance.
- [ ] Se verificó que la habilidad haga preguntas solo cuando corresponde.
- [ ] Se verificó que no invente datos para completar la salida.
- [ ] Se verificó que el resultado respete la plantilla.
- [ ] Se corrigieron los fallos observados.
