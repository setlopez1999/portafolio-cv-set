---
name: lamp-cord-reveal
description: Guía exhaustiva y autocontenida de la animación "cuerda de lámpara" del hero del portafolio (arrastre elástico tipo tela, apagón con foco defectuoso parpadeando, y revelado secuenciado del contenido). Léela para entender, modificar o reconstruir desde cero esta animación sin necesidad de ver el código actual primero.
---

# Animación: cuerda de lámpara con revelado del hero

## Qué hace esta animación (para el usuario final)

Al cargar la página, la sección `#inicio` está a oscuras (fondo casi negro), con un foco/lámpara colgando arriba a la derecha que **parpadea débilmente y de forma irregular**, como un foco flojo o mal conectado. De esa lámpara cuelga una cuerda con una manija.

El usuario debe **arrastrar la manija hacia abajo** (no basta un clic) más allá de un umbral. Mientras arrastra:
- La cuerda se estira siguiendo el dedo/cursor con un ligero retraso elástico (no es rígida ni sigue el cursor 1:1).
- Si mueve el cursor de lado a lado mientras arrastra, la cuerda **se balancea** (como una tira real, no solo responde al eje vertical).
- Si arrastra más allá de un largo "cómodo", la cuerda **resiste elásticamente** (efecto goma/rubber-band) en vez de topar en seco.

Al soltar:
- Si no arrastró lo suficiente, la cuerda simplemente **regresa a su posición de reposo** (resorte) y no pasa nada más.
- Si arrastró lo suficiente, la cuerda **se repliega primero** (rápido pero visible, no instantáneo) y, mientras puede seguir balanceándose suavemente de fondo, **arranca la secuencia de encendido**: el foco se enciende, el fondo se ilumina, aparecen partículas, la foto de perfil aparece con fade, y el texto (nombre, rol, descripción, botones) se revela con stagger.

Un clic simple sobre la manija (sin arrastre real) **no debe encender nada** — es una regla de producto explícita, no un descuido.

Si el usuario tiene activado "reducir movimiento" (`prefers-reduced-motion`), toda la animación se omite: la escena aparece encendida de inmediato, sin cuerda, sin parpadeo, sin timeline.

## Dónde vive el código

- Componente principal: `app/components/experience/LampRevealHero.vue` (toda la lógica de física, eventos e ignición vive aquí, en un único `<script setup>`).
- Componente hijo decorativo: `app/components/experience/CityArt.vue` — dibuja el skyline de líneas SVG detrás del contenido; expone una prop `revealed: boolean` y hace su propio "dibujado" de trazos (`stroke-dashoffset`) cuando `revealed` pasa a `true`. Este componente **no se toca** para la animación de la cuerda; solo se le pasa `:revealed="isLit"`.
- Composable de accesibilidad: `app/composables/useReducedMotion.ts` — expone `prefersReducedMotion` (ref reactivo ligado a `matchMedia('(prefers-reduced-motion: reduce)')`). Todo el código de física/GSAP debe consultarlo antes de animar.
- Librería de animación: GSAP (`import gsap from 'gsap'`), ya es dependencia del proyecto.

## Modelo de estado (refs de Vue)

Todas viven en el `<script setup>` de `LampRevealHero.vue`:

| Ref | Tipo | Significado |
|---|---|---|
| `isLit` | boolean | Verdadero cuando la escena ya está encendida/revelada. Controla clases CSS (`.is-lit`, `.profile-orbit--lit`, `.copy--revealed`) y la prop `revealed` de `CityArt`. |
| `isPulling` | boolean | Verdadero mientras el puntero está presionado sobre la manija arrastrando. |
| `isCommitted` | boolean | Verdadero desde el instante en que se decide "esto va a encender" (al soltar tras superar el umbral), hasta que el ciclo de vida se reinicia. Bloquea nuevos `pointerdown` mientras la secuencia de encendido está en curso. |
| `pullDistance` | number (px) | Estiramiento visual actual de la cuerda. Sigue a `targetPull` vía resorte, nunca se asigna directo desde el puntero. |
| `sway` | number (deg) | Inclinación/balanceo lateral actual. Sigue a `targetSway` vía resorte. |
| `targetPull` / `targetSway` | number | Objetivos que el resorte persigue cada frame. `movePull` los actualiza; `endPull`/`resetPull` los llevan a `0`. |
| `pullVelocity` / `swayVelocity` | number | Velocidades internas del integrador del resorte (no tocar desde fuera de `runSpring`). |
| `physicsFrame` | number\|null | id de `requestAnimationFrame` del lazo de física, para poder cancelarlo. |
| `startX/startY/lastX/lastY/lastMoveTime` | number | Estado auxiliar para calcular deltas de puntero entre eventos consecutivos. |
| `flickerTween` | `gsap.core.Timeline \| null` | Timeline del parpadeo de foco defectuoso (fase "apagado"). Se mata (`.kill()`) justo antes de arrancar la secuencia de encendido. |

## Constantes de ajuste (todas en `LampRevealHero.vue`, cerca del tope del `<script setup>`)

```js
const maxPullDistance = 132   // largo "cómodo": hasta aquí el arrastre es 1:1 (sin resistencia)
const absoluteMaxPull = 172   // tope absoluto duro; nunca se supera aunque el usuario arrastre muchísimo más
const maxSway = 26            // grados máximos de inclinación lateral
const SUBSTEP = 1 / 120       // paso fijo de integración del resorte (ver sección de física)
```

Umbral de igniciión: en `endPull`, `pullDistance.value > 58` decide si al soltar se enciende o se resetea. Si se ajusta `maxPullDistance`/`absoluteMaxPull`, revisar que este umbral siga teniendo sentido relativo (debe ser bastante menor que `maxPullDistance`, para que "un arrastre real" sea inequívoco frente a un roce accidental).

Constantes del resorte (dentro de `runSpring`, en el bucle de sub-pasos):
```js
pullVelocity.value += pullError * 210 * step
pullVelocity.value *= Math.exp(-13 * step)
swayVelocity.value += swayError * 150 * step
swayVelocity.value *= Math.exp(-6.5 * step)
```
- `210`/`150` son las "rigideces" (k) del resorte de largo y de balanceo respectivamente.
- `13`/`6.5` son los coeficientes de amortiguación. El de largo (`13`) es más alto a propósito: el repliegue vertical debe verse **rápido y decidido**. El de balanceo (`6.5`) es deliberadamente más bajo para que oscile como un péndulo real (varias idas y vueltas decrecientes) en vez de frenar en seco.

## La física, paso a paso

### 1. Resistencia elástica al estirar (rubber-band)

```js
const applyPullResistance = (raw) => {
  if (raw <= maxPullDistance) return raw
  const overflow = raw - maxPullDistance
  const range = absoluteMaxPull - maxPullDistance
  return maxPullDistance + range * (1 - Math.exp(-overflow / (range * 0.9)))
}
```
Por debajo de `maxPullDistance` el objetivo sigue el puntero 1:1. Por encima, se aplica una curva exponencial de rendimientos decrecientes que se acerca asintóticamente a `absoluteMaxPull` sin llegar nunca a excederlo. Esto es lo que da la sensación de "estirar una goma": cuesta cada vez más avanzar.

Esta función se aplica al **`rawDistance`** (distancia vertical cruda del puntero desde el punto de inicio del arrastre) para producir `targetPull` — nunca se le aplica directamente a `pullDistance` (eso lo hace el resorte).

### 2. El resorte persigue el objetivo continuamente — incluso durante el arrastre

Este es el cambio de diseño clave frente a una implementación "rígida": **no** se asigna `pullDistance.value = distance` directamente en cada evento de puntero. En su lugar:
- `movePull` solo actualiza `targetPull`/`targetSway` (con la resistencia elástica ya aplicada a `targetPull`).
- El lazo de física (`runSpring`, corriendo en `requestAnimationFrame`) es el único que escribe en `pullDistance`/`sway`, siempre "persiguiendo" con retraso a `targetPull`/`targetSway`.
- El lazo arranca en `startPull` (al presionar) y se mantiene corriendo durante todo el arrastre, no solo al soltar.

Esto es lo que produce el efecto "tela real": la manija no salta instantáneamente a la posición del cursor, sino que lo persigue con una inercia perceptible, igual que colgaría un cordón físico de una lámpara.

### 3. Integración en sub-pasos fijos (crítico para que no "teletransporte")

**Bug real encontrado y corregido durante el desarrollo**: si se integra el resorte con un solo paso de Euler usando el `delta` completo del frame (hasta ~32-50ms), y el error entre `pullDistance` y `targetPull` es grande (por ejemplo, 170px de un tirón que luego suelta hacia `target=0`), la fórmula `velocidad += error * k * delta` produce un impulso gigantesco en un único frame (con `k=210` y `error=170` y `delta=0.032`, el impulso es de ~1142 unidades). El resultado visual es que la cuerda **se teletransporta** de vuelta a `0` en 1-2 frames en vez de replegarse de forma visible — se ve como un salto instantáneo, no como un resorte.

La solución: subdividir cada frame en sub-pasos fijos pequeños (`SUBSTEP = 1/120`, ~8.3ms) y aplicar la integración del resorte en un bucle `while` dentro de `tick()`, en vez de una sola vez con el `delta` completo:

```js
const tick = (now) => {
  let remaining = Math.min(0.05, Math.max(0.001, (now - previous) / 1000))
  previous = now
  while (remaining > 0) {
    const step = Math.min(SUBSTEP, remaining)
    remaining -= step
    // ... aplicar las fórmulas de pullError/swayError/velocidad/posición usando `step`, no `remaining` ni el delta completo ...
  }
  // ... comprobar asentamiento y decidir si programar otro requestAnimationFrame ...
}
```
Si se reimplementa esta animación desde cero y se nota que el repliegue "salta" en vez de deslizarse, la causa casi segura es esta: falta la subdivisión en sub-pasos.

### 4. Condición de "asentado" desacoplada entre largo y balanceo

Otro bug real encontrado: si la condición para disparar el encendido exige que **tanto** el largo **como** el balanceo estén completamente asentados (`< 0.08` de error y de velocidad en ambos), y el balanceo tiene amortiguación baja (para que oscile como péndulo), esa condición puede tardar mucho más de un segundo en cumplirse — el encendido queda pegado esperando a que termine de mecerse.

La solución es separar dos condiciones dentro del mismo lazo de `runSpring`:
- `pullSettled`: solo mira el largo (`targetPull` vs `pullDistance` y su velocidad).
- `swaySettled`: solo mira el balanceo.

El callback de encendido (pasado como `onPullSettled` a `runSpring`) se dispara **una sola vez**, en cuanto `pullSettled` es verdadero (con una bandera local `pullSettledFired` para no repetirlo), sin esperar a `swaySettled`. El lazo de `requestAnimationFrame`, en cambio, sigue corriendo hasta que **ambas** condiciones se cumplen, para que el balanceo residual se siga viendo (y suavizando) de fondo mientras la escena ya se está revelando.

```js
const runSpring = (onPullSettled) => {
  // ...
  let pullSettledFired = false
  const tick = (now) => {
    // ... integración en sub-pasos ...
    const pullSettled = Math.abs(targetPull.value - pullDistance.value) < 0.08 && Math.abs(pullVelocity.value) < 0.08
    const swaySettled = Math.abs(targetSway.value - sway.value) < 0.08 && Math.abs(swayVelocity.value) < 0.08

    if (pullSettled && !pullSettledFired && !isPulling.value) {
      pullSettledFired = true
      onPullSettled?.()
    }
    if (pullSettled && swaySettled && !isPulling.value) {
      // fin del lazo
    }
  }
}
```

### 5. Ignorar eventos de puntero duplicados sin desplazamiento real

**Bug real encontrado durante las pruebas automatizadas** (con Playwright/Chromium simulando arrastre con mouse): el navegador puede emitir eventos `pointermove` consecutivos con el mismo `clientX`/`clientY` que el evento anterior (delta cero), intercalados con los eventos que sí traen movimiento real. Si el cálculo de `deltaX`/`deltaY` se hace ingenuamente como `event.clientX - lastX.value` en cada evento, esos eventos duplicados producen `deltaX = 0`, lo que **cancela** el `targetSway` calculado por el evento anterior en el mismo instante (porque `targetSway` se recalcula desde cero en cada llamada, no se acumula). El síntoma es que el balanceo lateral nunca se nota, aunque el usuario sí esté moviendo el cursor de lado a lado.

La corrección, al inicio de `movePull`:
```js
if (event.clientX === lastX.value && event.clientY === lastY.value) return
```
Esto protege tanto contra el artefacto de pruebas automatizadas como contra cualquier hardware real que pudiera duplicar coordenadas (algunos lápices/touch a veces re-disparan eventos por presión o inclinación sin mover x/y).

## Ciclo de vida de la interacción (eventos)

Todos los listeners están en el botón `.lamp__handle`:
```html
<button
  @pointerdown="startPull"
  @pointermove="movePull"
  @pointerup="endPull"
  @pointercancel="cancelPull"
  @dragstart.prevent
  @keydown.enter.prevent="revealScene"
  @keydown.space.prevent="revealScene"
>
```
Importante: **no hay `@click`**. Un clic simple no debe encender nada — solo un arrastre real (vía `pointerdown`/`pointermove`/`pointerup`) que supere el umbral, o la vía de teclado accesible (Enter/Espacio, que llama a `revealScene` directamente, sin pasar por la física de la cuerda, ya que un usuario de teclado no puede "arrastrar").

- **`startPull(event)`**: si ya está encendido o ya comprometido (`isCommitted`), no hace nada. Si no, marca `isPulling = true`, guarda la posición inicial, captura el puntero (`setPointerCapture`) y **arranca el lazo de resorte** (`runSpring()`), que se queda corriendo indefinidamente mientras haya arrastre o algo que asentar.
- **`movePull(event)`**: ignora eventos sin desplazamiento real (ver arriba). Calcula `rawDistance` (vertical, desde el punto de inicio) y lo pasa por `applyPullResistance` para obtener `targetPull`. Calcula `targetSway` a partir del delta horizontal más un componente de "velocidad vertical" (para que un tirón rápido también añada un poco de balanceo, como pasaría con una cuerda física real), recortado a `±maxSway`.
- **`endPull()`**: si `pullDistance.value > 58`, marca `isCommitted = true`, pone `targetPull`/`targetSway` en `0` y llama a `runSpring(() => revealScene())` (o, si `prefers-reduced-motion`, salta directo a `revealScene()`). Si no superó el umbral, llama a `resetPull()` (que simplemente vuelve todo a `0` vía el mismo resorte, sin encender nada).
- **`cancelPull()`**: como un `endPull` que nunca enciende — se usa para `pointercancel` (p. ej. el sistema operativo interrumpe el gesto).
- **`revealScene()`**: función idempotente (`if (isLit.value) return`) que marca `isLit = true`, mata el `flickerTween`, y dispara el timeline de GSAP de revelado (o el camino instantáneo si `prefers-reduced-motion`).

## Timeline de revelado (GSAP)

Dentro de `revealScene`, si no hay `prefers-reduced-motion`:
```js
gsap.set([beamRef.value, ambientRef.value], { opacity: 0, scale: 0.78 }) // limpia cualquier estado dejado por el parpadeo

const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
tl.to([beamRef.value, ambientRef.value], { opacity: 1, scale: 1.08, duration: 0.9, ease: 'power2.out' })
  .fromTo(particlesRef.value?.children ?? [], { opacity: 0, scale: 0, y: 20 }, { opacity: 0.9, scale: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'back.out(2)' }, '-=0.7')
  .to(contentRef.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
  .fromTo(copyRef.value?.children ?? [], { opacity: 0, y: 22, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.58, stagger: 0.08, ease: 'power3.out' }, '-=0.46')
```
Los offsets negativos (`'-=0.7'`, etc.) hacen que cada paso empiece un poco antes de que termine el anterior (overlap), para que el conjunto se sienta como una sola ráfaga de luz y no como pasos discretos.

`isLit.value = true` se asigna **antes** de este timeline (síncronamente, al entrar a `revealScene`), no al final — eso es lo que dispara vía CSS/props reactivas: la clase `.is-lit` en `.lamp-hero`, `.profile-orbit--lit` en la foto, `.copy--revealed` en el texto, y `:revealed="isLit"` hacia `CityArt` (que dibuja su propio skyline con `stroke-dashoffset`).

## Foto de perfil: fade real, no solo un cambio de opacidad a mitad de camino

La foto usa una transición CSS pura, no GSAP:
```css
.profile-orbit {
  opacity: 0;   /* invisible en reposo — no 0.84 ni ningún valor intermedio */
  transform: translateX(clamp(0rem, 2vw, 2rem)) scale(0.94);
  transition: opacity 1100ms var(--ease-out), transform 900ms var(--ease-out), filter 900ms var(--ease-out);
}
.profile-orbit--lit {
  opacity: 1;
  filter: drop-shadow(0 0 30px var(--color-lamp-glow));
  transform: translateX(clamp(0rem, 2vw, 2rem)) scale(1);
}
```
Como la clase `.profile-orbit--lit` se activa exactamente cuando `isLit` pasa a `true` (mismo instante que dispara el timeline de GSAP), el fade de la foto queda sincronizado con el resto de la revelación sin necesitar tocarla desde GSAP.

**Error a evitar**: si la opacidad de reposo no es `0` (p. ej. `0.84`, como estaba antes de esta iteración), la foto ya es visible antes de encender, y el efecto dejar de ser un "fade real" — se nota como un simple cambio de brillo, no una aparición.

## Parpadeo de "foco defectuoso" en el estado apagado

Mientras `!isLit` (y sin `prefers-reduced-motion`), un timeline de GSAP en bucle infinito hace parpadear `beamRef`/`ambientRef` de forma aleatoria y mayormente oscura:
```js
const startFlicker = () => {
  if (prefersReducedMotion.value || isLit.value) return
  flickerTween = gsap.timeline({ repeat: -1 })
  for (let i = 0; i < 7; i += 1) {
    flickerTween
      .to([beamRef.value, ambientRef.value], { opacity: () => gsap.utils.random(0.06, 0.2), duration: () => gsap.utils.random(0.05, 0.16), ease: 'power1.inOut' })
      .to([beamRef.value, ambientRef.value], { opacity: 0, duration: () => gsap.utils.random(0.12, 0.32), ease: 'power1.inOut' })
      .to({}, { duration: () => gsap.utils.random(0.9, 3.2) }) // pausa oscura, variable
  }
}
```
Claves de este patrón:
- Se usan **funciones** (`() => gsap.utils.random(...)`) como valor de las propiedades del tween, no valores fijos — así cada repetición del timeline (`repeat: -1`) recalcula valores nuevos y no se ve como un loop idéntico y predecible.
- El ciclo de "7 destellos + pausas" se arma una vez y luego se repite entero; con pausas de hasta 3.2s por destello, el loop completo dura bastante (~15-20s), así que la repetición no se percibe.
- La proporción destello/pausa está pensada para que la mayor parte del tiempo esté completamente oscuro (`opacity: 0`), con destellos breves y de baja intensidad (`0.06`–`0.2` de opacidad) — el efecto es "casi apagado, con fallas ocasionales", no un parpadeo rítmico tipo advertencia.

`startFlicker()` se llama una vez en `onMounted` (si no hay `prefers-reduced-motion`). Se detiene y limpia (`flickerTween?.kill(); flickerTween = null`) al principio de `revealScene()`, justo antes de forzar `opacity: 0` en esos mismos elementos para arrancar el timeline de encendido desde un estado limpio y predecible (si no se limpia, el timeline de encendido puede pelear visualmente contra el último tween de parpadeo en curso).

## Cómo la cuerda se dibuja y flexiona (SVG + CSS vars)

El path de la cuerda es un SVG con `preserveAspectRatio="none"` que se estira verticalmente vía una variable CSS:
```html
<svg class="lamp__rope" :style="ropeStyle" viewBox="0 0 100 100" preserveAspectRatio="none">
  <path class="lamp__rope-path" :d="ropePath" />
</svg>
```
```js
const ropePath = computed(() => {
  const bend = sway.value * 0.82
  const midpoint = 50 + sway.value * 0.46
  return `M 50 0 C ${50 + bend * 0.22} 28 ${midpoint} 62 ${50 + bend} 100`
})
const ropeStyle = computed(() => ({ '--pull-distance': `${pullDistance.value}px` }))
```
```css
.lamp__rope {
  height: calc(7.3rem + var(--pull-distance, 0px));
}
```
El `viewBox` es fijo (`0 0 100 100`) pero el elemento SVG se estira en alto según `--pull-distance`; como es una curva bezier (no una línea recta), el `sway` desplaza el punto medio de la curva (`midpoint`) y el punto de control (`bend`), lo que hace que la cuerda se vea genuinamente curva/inclinada en vez de solo rotada como un objeto rígido.

La manija, en cambio, sí se traslada y rota como un cuerpo rígido (es un `<button>`, no tiene sentido flexionarlo):
```js
const handleStyle = computed(() => ({
  '--handle-y': `${pullDistance.value}px`,
  '--handle-rotation': `${sway.value}deg`,
}))
```
```css
.lamp__handle {
  transform: translate(-50%, var(--handle-y, 0px)) rotate(var(--handle-rotation, 0deg));
  transform-origin: top center;
}
```

## Accesibilidad

En **todos** los puntos de entrada (`onMounted`, `startFlicker`, `revealScene`, `startPull`/`movePull` implícitamente porque nunca se llega ahí si `isLit` ya es `true`), se consulta `prefersReducedMotion` desde `useReducedMotion()`. Si está activo:
- `onMounted` pone `isLit.value = true` de inmediato y no arranca ni la física ni el parpadeo.
- Si por algún camino se llega a `endPull` con el umbral superado y `prefersReducedMotion` es verdadero, se salta directo a `revealScene()` sin pasar por el resorte.
- Dentro de `revealScene()`, la rama de `prefersReducedMotion` fija opacidades a `1` directamente por `style.opacity`, sin timeline.

Cualquier animación nueva que se agregue a este componente debe respetar este mismo patrón: comprobar el flag y ofrecer un camino instantáneo equivalente.

## Cómo probar esta animación (lecciones de las pruebas reales hechas en este proyecto)

Se validó con Playwright + Chromium headless, simulando arrastre con `page.mouse.down()/move()/up()` y leyendo directamente los atributos `style` (`--handle-y`, `--handle-rotation`) del elemento `.lamp__handle`, además de la clase `.is-lit` en `.lamp-hero`. Dos trampas encontradas al hacerlo, útiles para quien repita el proceso:

1. **Hay un preloader previo** (`PreloaderScene.vue`, componente aparte, no relacionado con esta skill) que cubre toda la pantalla con `pointer-events: auto` mientras cargan los assets (la foto de perfil pesa ~1.8MB). Si se intenta interactuar con la manija antes de que ese preloader termine, los clics/arrastres simplemente no llegan al botón — hay que esperar explícitamente a que `.preloader` tenga `pointer-events: none` (o desaparezca) antes de simular cualquier interacción.
2. **Los eventos de mouse sintéticos pueden duplicar coordenadas** (ver la sección de física arriba) — si al probar el balanceo lateral se ve siempre en `0`, sospechar primero de este artefacto antes que de un bug real en el cálculo de `sway`.

## Resumen para reconstruir desde cero (checklist)

1. Estado con `pullDistance`/`sway` como valores **seguidos por resorte**, nunca asignados directo desde el puntero.
2. Resistencia elástica (`applyPullResistance`) aplicada al calcular `targetPull`, no al aplicar `pullDistance`.
3. Resorte con integración en **sub-pasos fijos** (no un solo paso de Euler con el delta completo del frame).
4. Condición de "asentado" **separada** para largo vs. balanceo; el callback de encendido solo espera al largo.
5. Ignorar eventos de puntero con delta cero.
6. Sin `@click` en la manija — solo arrastre real (pointer events) o teclado (Enter/Espacio) disparan el encendido.
7. `isLit` se activa **antes** de la animación GSAP de revelado (síncrono), no al final.
8. Foto en `opacity: 0` de reposo (fade real, no cambio de brillo).
9. Parpadeo de foco con valores aleatorios por función (no timeline fijo) y proporción destello/pausa muy inclinada hacia la oscuridad.
10. Todo con bypass completo para `prefers-reduced-motion`.
