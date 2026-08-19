import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ORCAMENTO_WHATSAPP_NUMBER,
  buildOrcamentoMessage,
  buildOrcamentoWhatsAppLink,
  validateOrcamentoValues,
} from '../js/orcamento-form.js';

const quoteData = {
  nome: '  Maria   Souza  ',
  cidade: ' Londrina - PR ',
  produto: 'Espuma em bloco D28',
  detalhes: ' 2 × 1 × 0,10 m ',
};

test('buildOrcamentoMessage creates a readable quote request', () => {
  assert.equal(
    buildOrcamentoMessage(quoteData),
    [
      'Olá! Vim pelo site da Rocha Decor Espumas e gostaria de solicitar um orçamento.',
      '',
      'Nome: Maria Souza',
      'Cidade: Londrina - PR',
      'Produto: Espuma em bloco D28',
      'Medidas ou quantidade: 2 × 1 × 0,10 m',
    ].join('\n'),
  );
});

test('buildOrcamentoMessage omits optional details when empty', () => {
  const message = buildOrcamentoMessage({ ...quoteData, detalhes: '   ' });

  assert.doesNotMatch(message, /Medidas ou quantidade/);
  assert.doesNotMatch(message, /undefined|null/);
});

test('validateOrcamentoValues rejects required fields containing only spaces', () => {
  assert.deepEqual(
    validateOrcamentoValues({
      nome: '   ',
      cidade: '\n\t',
      produto: '',
      detalhes: '',
    }),
    {
      nome: 'Digite seu nome.',
      cidade: 'Digite sua cidade.',
      produto: 'Selecione um produto.',
    },
  );
});

test('validateOrcamentoValues accepts complete quote data', () => {
  assert.deepEqual(validateOrcamentoValues(quoteData), {});
});

test('buildOrcamentoWhatsAppLink uses the confirmed phone and encoded message', () => {
  const link = buildOrcamentoWhatsAppLink(quoteData);
  const url = new URL(link);

  assert.equal(ORCAMENTO_WHATSAPP_NUMBER, '5543984888884');
  assert.equal(url.origin + url.pathname, 'https://wa.me/5543984888884');
  assert.equal(url.searchParams.get('text'), buildOrcamentoMessage(quoteData));
  assert.match(link, /%C3%A1/);
});
