# Guía de portabilidad

## Estructura universal

La forma más portable de una habilidad es un archivo Markdown con un encabezado de metadatos y un cuerpo de instrucciones. El núcleo debe poder copiarse y pegarse en cualquier agente que acepte instrucciones de texto.

```text
nombre-de-la-habilidad/
├── SKILL.md
├── references/
├── templates/
└── scripts/
```

`SKILL.md` es obligatorio. Las demás carpetas son opcionales.

## Frontmatter

Para sistemas compatibles con YAML frontmatter, usar:

```yaml
---
name: nombre-en-minusculas-y-con-guiones
description: Qué hace la habilidad y cuándo debe activarse.
---
```

Si otra plataforma no interpreta frontmatter, conservar los mismos datos como una sección inicial:

```markdown
# Nombre de la habilidad

**Propósito:** Qué hace.

**Activar cuando:** Cuándo usarla.
```

No asumir que el nombre del campo, el directorio de instalación o el mecanismo de activación son iguales en todas las plataformas.

## Recursos auxiliares

Si la plataforma soporta carpetas, mantener los enlaces relativos desde `SKILL.md`:

```markdown
Leer [references/guia.md](references/guia.md) cuando la solicitud requiera la variante avanzada.
```

Si la plataforma solo acepta un archivo, combinar el contenido esencial de las referencias al final de `SKILL.md` y conservar únicamente las reglas necesarias. No pegar recursos enormes si no son indispensables.

## Scripts

Los scripts aumentan la automatización, pero reducen la portabilidad. Incluirlos solo cuando aporten una operación determinista importante. Documentar:

1. Lenguaje y versión requerida.
2. Entradas y salidas.
3. Comando de ejecución.
4. Dependencias.
5. Manejo de errores.
6. Alternativa manual cuando el sistema no permita ejecutar código.

Nunca incluir credenciales ni asumir que un script tiene acceso a cuentas, archivos o herramientas del usuario.

## Herramientas específicas

Separar el flujo universal de las instrucciones específicas:

```markdown
## Flujo universal
Analizar el archivo, extraer los datos, aplicar las reglas y validar la salida.

## Adaptación para Plataforma A
Usar el mecanismo de archivos de Plataforma A.

## Adaptación para Plataforma B
Pegar el contenido en el campo de instrucciones y adjuntar las referencias necesarias.
```

No escribir una habilidad que dependa de una herramienta propietaria si el objetivo es que funcione en cualquier IA. Cuando una dependencia sea necesaria, declararla y ofrecer una alternativa.

## Paquete de entrega

Para una plataforma con instalación de skills, entregar el directorio completo o su formato empaquetado. Para una IA que solo acepte texto, entregar `SKILL.md` y, si existen, las referencias relevantes en mensajes separados o en un único documento.

## Compatibilidad mínima

Una habilidad portable debe poder funcionar con estas capacidades básicas:

- Leer Markdown.
- Seguir instrucciones secuenciales y condicionales.
- Leer archivos adjuntos o referencias cuando estén disponibles.
- Producir texto estructurado.
- Declarar limitaciones y pedir datos faltantes.

Si necesita navegación web, ejecución de código, edición de imágenes, acceso a APIs o generación de archivos, documentar esas capacidades como dependencias opcionales y no como capacidades universales.
