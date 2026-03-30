# SuccessModal — Guía de uso

## Componente

`src/components/ui/SuccessModal.astro`

## Características

✅ Dos variantes: `contact` y `talent`
✅ Animaciones elegantes (entrada, checkmark, glow)
✅ Minimalismo refinado con colores BlueVex
✅ Totalmente responsivo
✅ Cierre por ESC, click en backdrop, o botón
✅ Accesible (ARIA labels, keyboard support)

## Importación

```astro
---
import SuccessModal from '../components/ui/SuccessModal.astro';
---

<SuccessModal type="contact" isOpen={false} data-success-modal-type="contact" />
<SuccessModal type="talent" isOpen={false} data-success-modal-type="talent" />
```

## API

### Props

| Prop     | Type                    | Default     | Descripción        |
| -------- | ----------------------- | ----------- | ------------------ |
| `type`   | `'contact' \| 'talent'` | `'contact'` | Variante del modal |
| `isOpen` | `boolean`               | `false`     | Estado inicial     |

### Data Attribute

Agrega `data-success-modal-type="contact"` o `data-success-modal-type="talent"` para permitir que el JavaScript lo encuentre.

## Uso en JavaScript

### Abrir modal

```javascript
// Desde un formulario
window.openSuccessModal("contact");
window.openSuccessModal("talent");
```

### Cerrar modal

```javascript
window.closeSuccessModal("contact");
window.closeSuccessModal("talent");
```

## Ejemplo en un formulario

```astro
---
import SuccessModal from '../components/ui/SuccessModal.astro';
---

<form id="contact-form">
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <textarea name="message"></textarea>
  <button type="submit">Enviar</button>
</form>

<SuccessModal type="contact" data-success-modal-type="contact" />

<script>
  document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Enviar formulario
    // await fetch('/api/contact', { ... });

    // Mostrar modal de éxito
    window.openSuccessModal('contact');

    // Resetear formulario
    (e.target as HTMLFormElement).reset();
  });
</script>
```

## Textos

### Contact

- **Título**: "Mensaje recibido"
- **Subtitle**: "Nos pondremos en contacto en breve. Gracias por tu confianza."

### Talent

- **Título**: "¡Bienvenido al equipo!"
- **Subtitle**: "Hemos recibido tu candidatura. Pronto te contactaremos para hablar de tu proyecto con nosotros."

## Personalización

Para cambiar los textos, edita en `SuccessModal.astro`:

```astro
const messages = {
  contact: {
    title: 'Tu título aquí',
    subtitle: 'Tu subtítulo aquí',
  },
  talent: {
    title: '...',
    subtitle: '...',
  },
};
```

## Animaciones

- **Backdrop**: Fade in 300ms
- **Container**: Slide up + scale 500ms (cubic-bezier)
- **Icon circle**: Scale in 600ms con bounce
- **Checkmark**: Draw animation 800ms (empieza a los 200ms)
- **Content**: Fade in staggered (100ms, 200ms, 300ms)

## Accesibilidad

✅ `role="dialog"` en el modal
✅ `aria-modal="true"`
✅ `aria-hidden` dinámico
✅ Cierre con ESC
✅ Contraste de color WCAG AAA
✅ Semantic HTML

## Notas técnicas

- El component usa `position: fixed` para centrar en viewport
- Las animaciones son CSS-only (mejor performance)
- SVG inline del checkmark (sin peticiones externas)
- Gradientes y sombras sutiles para profundidad
- La glow es un pseudo-elemento con radial-gradient

---

**Color Palette**:

- Navy: `#162e4c`
- Cyan: `#2fa4d9`
- Background: `#f5f8fc`
- Gray: `#6b7280`
