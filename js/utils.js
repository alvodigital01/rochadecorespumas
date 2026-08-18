function formatBRL(value) {
  const [intPart, decPart = '00'] = value.toFixed(2).split('.');
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${withThousands},${decPart}`;
}

export function buildWhatsAppLink(phone, message) {
  const digitsOnly = String(phone).replace(/\D/g, '');
  const encoded = encodeURIComponent(message ?? '');
  return `https://wa.me/${digitsOnly}${encoded ? `?text=${encoded}` : ''}`;
}

export function formatPriceRange(min, max, unit) {
  if (min === max) {
    return `${formatBRL(min)} / ${unit}`;
  }
  return `${formatBRL(min)} – ${formatBRL(max)} / ${unit}`;
}
