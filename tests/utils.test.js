import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWhatsAppLink, formatPriceRange } from '../js/utils.js';

test('buildWhatsAppLink strips non-digit characters from the phone number', () => {
  const link = buildWhatsAppLink('55 43 98488-8884', 'Olá');
  assert.equal(link.startsWith('https://wa.me/5543984888884'), true);
});

test('buildWhatsAppLink encodes the message as a text query param', () => {
  const link = buildWhatsAppLink('5543984888884', 'Olá! Gostaria de saber sobre D18');
  assert.equal(
    link,
    'https://wa.me/5543984888884?text=Ol%C3%A1!%20Gostaria%20de%20saber%20sobre%20D18'
  );
});

test('buildWhatsAppLink omits the text param when the message is empty', () => {
  const link = buildWhatsAppLink('5543984888884', '');
  assert.equal(link, 'https://wa.me/5543984888884');
});

test('formatPriceRange formats two distinct values as a range', () => {
  const result = formatPriceRange(25, 35, 'm²');
  assert.equal(result, 'R$ 25,00 – R$ 35,00 / m²');
});

test('formatPriceRange collapses to a single price when min equals max', () => {
  const result = formatPriceRange(40, 40, 'm²');
  assert.equal(result, 'R$ 40,00 / m²');
});

test('formatPriceRange groups thousands with a dot', () => {
  const result = formatPriceRange(1234, 1234, 'm²');
  assert.equal(result, 'R$ 1.234,00 / m²');
});
