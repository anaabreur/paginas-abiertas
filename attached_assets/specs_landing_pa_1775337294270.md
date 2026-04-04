# 🗺️ PÁGINAS ABIERTAS — Product Specs: Landing Page
**Versión 1.0 · Abril 2026**

---

## Meta

| Campo | Detalle |
|---|---|
| Plataforma | Replit (React + Tailwind) |
| Acceso | Público — sin login requerido |
| Usuarios objetivo | Miembros del club (12–17 años) + visitantes curiosas |
| Idioma | Español |
| Estilo visual | Branding Páginas Abiertas + estética de viajes / pasaporte |
| Estructura | Single page con scroll + navbar fija |
| Administración | Panel en ruta `/admin` protegido por contraseña simple hardcodeada |

---

## SECCIÓN 1 — Visión General

La landing de Páginas Abiertas es el punto de contacto digital del club. No requiere registro ni login. Funciona como tablero de comunidad: las miembros pueden ver su posición en el ranking, votar por el próximo libro y conocer el club — todo desde un solo lugar, con una estética que evoca los viajes y el espíritu explorador del club.

### Propósito principal
- Mostrar el club y sus valores a nuevas visitantes
- Permitir a las miembros votar por el próximo libro a leer
- Mostrar el leaderboard de puntos con identidades protegidas (alias + avatar)
- Comunicar el libro actual en lectura y el progreso del club

### Lo que NO es
- No es una app con cuentas de usuario ni perfil persistente
- No expone nombres reales ni datos personales de las miembros
- No tiene foros, comentarios ni chat
- No gestiona pagos (la membresía es gratuita)

---

## SECCIÓN 2 — Diseño & Estética

El diseño combina el branding oficial del club con una estética de viajes: pasaportes, mapas, sellos, brújulas, aviones de papel y rutas punteadas. Moderno, limpio, con energía juvenil — no infantil.

### Paleta de colores oficial

| Nombre | Hex | Uso principal |
|---|---|---|
| Coral Primario | `#E8523A` | CTAs, títulos, énfasis |
| Celeste Activo | `#4DC8E0` | Secciones alternas, íconos |
| Amarillo Vibrante | `#F5E642` | Highlights, badges, estrellas |
| Azul Noche | `#0F1F3D` | Fondos hero, navbar, contraste |
| Negro Tipográfico | `#1A1A1A` | Cuerpo de texto |

### Tipografía
- **Display / títulos:** Poppins Bold — peso fuerte, personalidad
- **Cuerpo:** Inter Regular — limpio y legible en pantalla
- **Acento:** Poppins Italic — para citas y frases del club

### Elementos visuales de viaje
Estos elementos se usan como decoración de fondo, separadores de sección y acentos visuales:

- 🗺️ Mapas y rutas punteadas como separadores de sección
- ✈️ Avión de papel en el hero
- 📍 Pin de ubicación para marcar el libro actual
- 🧭 Brújula como ícono del sistema de rangos
- 📖 Libro abierto — ícono central del club (logo)
- 🎫 Estampas / sellos de pasaporte como badges de género
- ⭐ Estrellas doradas para el leaderboard
- Líneas diagonales y formas geométricas al estilo del pasaporte físico

### Tono visual
- Moderno y limpio — no recargado
- Energético y colorido — no infantil
- Fondos oscuros (azul noche `#0F1F3D`) en hero y secciones de contraste
- Fondos blancos o gris muy claro en secciones de contenido
- Cards con bordes redondeados y sombras suaves
- Animaciones sutiles: hover en cards, contador de votos animado

---

## SECCIÓN 3 — Estructura de la Página

Single page con scroll continuo. Navbar fija permite saltar a cualquier sección.

### Navbar fija
> Componente global — siempre visible al hacer scroll

- **Izquierda:** Logo (ícono libro + "Páginas Abiertas")
- **Centro:** Links — Inicio · El Club · Votación · Exploradoras · Géneros
- **Derecha:** Botón CTA "¿Cómo unirme?" en coral
- **Móvil:** hamburger menu con menú desplegable
- **Fondo:** azul noche con leve transparencia al hacer scroll

---

### Sección 1 — Hero
> Primera impresión — sin scroll

- Fondo: azul noche con textura sutil de mapa o constelaciones
- Título grande: *"Tu próxima aventura empieza en una página"*
- Subtítulo: *"Club de lectura para exploradoras de 12 a 17 años"*
- Dos botones CTA:
  - `"Ver la votación"` — relleno coral
  - `"Conocer el club"` — outline blanco
- Elemento decorativo: avión de papel con ruta punteada que atraviesa la pantalla
- Badge flotante: libro actual en lectura — título + género con sello de pasaporte

---

### Sección 2 — El Club

- Fondo blanco / gris muy claro
- Título de sección: "El Club" con ícono de brújula
- Párrafo corto de descripción (2–3 líneas máximo)
- 3 cards horizontales con íconos grandes:
  - 📖 Cada libro es un destino
  - 🎫 Gana sellos en tu pasaporte
  - 🏆 Sube de rango como exploradora
- Frase del club en tipografía grande: *"No solo lees libros, viajas a mundos"*
- Línea de datos clave: `Gratuito · Presencial · 12–17 años · Cada 2 semanas`

---

### Sección 3 — Los 7 Países Literarios

- Título: "Elige tu destino" con ícono de mapa
- 7 cards en grid (4+3), estilo sello de pasaporte
- Cada card: emoji del género + nombre del país + descripción corta (1 línea) + color de fondo propio
- Hover: card se eleva ligeramente con sombra y muestra el color completo
- Solo informativo — sin interacción más allá del hover

| Emoji | País | Descripción | Color de fondo |
|---|---|---|---|
| 🔍 | País Misterio | Enigmas, pistas y detectives | `#1E2D6B` (azul oscuro) |
| 🏰 | País Fantasía | Magia, criaturas y mundos imposibles | `#6B21A8` (morado) |
| 💕 | País Romance | Cartas secretas y amores épicos | `#DB2777` (rosa) |
| 🚀 | País Ciencia Ficción | Naves, futuros locos y tecnología | `#64748B` (plateado) |
| 👻 | País Terror | Lecturas que dan miedo… y ganas de seguir | `#111111` (negro) |
| 🌟 | País Drama | Historias que te hacen llorar, reír y pensar | `#B45309` (dorado) |
| 🗺️ | País Aventura | Islas, mapas y personajes que nunca se rinden | `#15803D` (verde) |

---

### Sección 4 — Votación: ¿Qué leemos próximo?
> ⭐ Sección interactiva principal

- Título: *"¿Qué leemos próximo? Tú decides"* con ícono de papeleta
- Badge de estado: votación abierta / cerrada
- Contador de tiempo restante si la votación tiene fecha límite

#### Cards de libros candidatos
- Grid de 2–3 columnas (responsive: 1 en móvil)
- Cada card contiene:
  - Portada del libro (imagen)
  - Título y autor
  - Badge de género con color del país correspondiente
  - Sinopsis corta (máx. 3 líneas, truncada con "leer más")
  - Barra de progreso de votos con número total visible
  - Botón `"Votar por este"` en coral

#### Sistema de votación — Mecánica

Para votar, la miembro ingresa un código en un campo de texto. El código determina cuántos votos puede emitir:

| Tipo de código | Votos permitidos | Quién lo recibe |
|---|---|---|
| Código estándar | 1 voto | Todas las miembros activas — generado por sesión |
| Código premium (dorado) | 2 votos | Miembros que ganaron el privilegio (puntos extra / logros) |

**Reglas del sistema de códigos:**
- Los códigos son generados por la administradora por cada sesión de votación
- Un código solo puede usarse una vez — se marca como usado al votar
- Código inválido o ya usado → mensaje de error claro
- El código premium permite 2 votos: en el mismo libro o en libros distintos
- Una vez votado: confirmación visual con confetti, no puede volver a votar con ese código
- Los resultados son visibles en tiempo real (barras de progreso se actualizan al votar)
- Cuando la votación se cierra: las cards pasan a modo solo lectura, el ganador se destaca con sello

---

### Sección 5 — Exploradoras (Leaderboard)
> Ranking de puntos con identidades protegidas

Por privacidad (son menores de edad), ninguna miembro aparece con su nombre real. Cada una tiene un alias y un avatar elegido por ella misma.

#### Configuración de identidad — Flujo de la miembro

La primera vez que una miembro accede al leaderboard, un modal le pide configurar su identidad. Se guarda en `localStorage` — no requiere cuenta:

1. **Ingresa su alias** — nombre ficticio de viajera (ej. "Luna Baskerville", "Capi Atlas")
2. **Elige su avatar** — galería de íconos temáticos (exploradora, detective, astronauta, maga, etc.)
3. **Confirma** — alias + avatar quedan guardados en ese dispositivo

> **Nota:** La administradora es quien asigna los puntos desde el panel. El alias y avatar son la capa visual pública — la administradora los asocia internamente al nombre real.

#### Visualización del leaderboard

- Top 3 destacado visualmente: podio estilo pasaporte (🥇🥈🥉)
- Tabla de ranking con: posición · avatar · alias · badge de rango · puntos totales
- Badge de rango al lado del alias: `Novata` · `Viajera` · `Aventurera` · `Embajadora` · `Leyenda Literaria`
- Puntos en número grande, color coral
- Sin dato personal visible — solo alias, avatar y rango
- Animación sutil al cargar: filas en cascada

---

### Sección 6 — En Ruta Ahora (Libro Actual)

- Fondo: azul noche con textura de mapa
- Título: *"En Ruta Ahora 📍"* con pin animado
- Card grande del libro activo:
  - Portada del libro
  - Título, autor, badge de género
  - Semana actual del plan de lectura (ej. "Semana 3 de 6")
  - Barra de progreso de la lectura colectiva
  - Próxima sesión: fecha y hora
  - Actividad de la semana (ej. "Esta semana: Teorías visuales del lugar")
- Frase motivacional del club debajo de la card

---

### Footer

- Logo del club + tagline: *"Cada página es un nuevo destino"*
- Links rápidos: mismas secciones del navbar
- Redes sociales (TikTok, Instagram) si aplica
- Fondo azul noche
- Sin información personal de la administradora

---

## SECCIÓN 4 — Panel de Administración (`/admin`)

Ruta separada accesible por URL directa. Protegida por contraseña simple hardcodeada (no login público). Solo la administradora conoce la URL y la contraseña.

### Gestión de votación
- Crear nueva sesión de votación: título + fecha límite + libros candidatos
- Agregar libros: imagen (URL), título, autor, género, sinopsis
- Generar códigos: cantidad + tipo (estándar / premium)
- Ver lista de códigos con estado: `disponible` / `usado`
- Abrir y cerrar la votación manualmente
- Ver resultados en tiempo real con ganador destacado

### Gestión del leaderboard
- Ver tabla completa: alias, avatar, rango, puntos
- Editar puntos de cualquier miembro (campo numérico directo)
- El rango se actualiza automáticamente según los puntos
- Agregar nueva miembro: alias + avatar + puntos iniciales (0)
- Archivar miembro (ocultar del leaderboard público sin borrar)

### Gestión del libro actual
- Cambiar libro activo: portada, título, autor, género, sinopsis
- Actualizar semana actual del plan de lectura (1–6)
- Editar fecha y descripción de la próxima sesión
- Actualizar actividad de la semana

---

## SECCIÓN 5 — Funcionalidad & Reglas de Negocio

### Votación
- Un código = una sesión de votación. El código expira al usarse.
- Código estándar: 1 voto en un libro
- Código premium: 2 votos — en el mismo libro o en libros distintos
- Una vez votado: confirmación visual + código bloqueado
- Resultados visibles en tiempo real para todos
- Al cerrar la votación: ganador destacado con sello especial
- La administradora puede cerrar la votación en cualquier momento desde el panel

### Leaderboard
- Los puntos solo los actualiza la administradora desde el panel
- El rango se calcula automáticamente:

| Rango | Puntos |
|---|---|
| Novata | 0 – 150 pts |
| Viajera | 151 – 400 pts |
| Aventurera | 401 – 800 pts |
| Embajadora | 801 – 1,500 pts |
| Leyenda Literaria | 1,500+ pts |

- Alias y avatar se guardan en `localStorage` del dispositivo
- Si accede desde otro dispositivo: ve el leaderboard pero puede reconfigurar su identidad
- El leaderboard es visible para cualquier visitante de la landing

### Privacidad
- Ningún nombre real, foto ni dato personal aparece en la landing pública
- Los alias son elegidos por las miembros — la administradora puede editarlos desde el panel
- No se recolecta ningún dato personal: sin formularios, sin emails, sin cookies de tracking
- Los códigos de votación no están asociados a ninguna identidad en la interfaz pública

---

## SECCIÓN 6 — Responsive & Dispositivos

Diseño mobile-first — la mayoría de las miembros accederán desde móvil.

| Dispositivo | Breakpoint | Comportamiento clave |
|---|---|---|
| Móvil (prioridad) | < 768px | 1 columna, navbar hamburger, cards en stack, votación ocupa pantalla completa |
| Tablet | 768–1024px | 2 columnas en grid de géneros y votación, navbar completa |
| Desktop | > 1024px | Layout completo, 3–4 columnas en grids, hero con elementos decorativos expandidos |

---

## SECCIÓN 7 — Fuera de Alcance (V1)

Lo siguiente queda explícitamente fuera del alcance de la primera versión:

- Sistema de cuentas de usuario o login para miembros
- Notificaciones por email o push
- Chat o comentarios en tiempo real
- Historial completo de lecturas pasadas
- Integración con redes sociales (compartir automático)
- Multilenguaje
- Panel de admin con autenticación formal (en V1 es URL + contraseña hardcodeada)

---

*"No solo lees libros, viajas a mundos. No solo eres lectora, eres exploradora."*
**Páginas Abiertas · Product Specs Landing Page · v1.0**
