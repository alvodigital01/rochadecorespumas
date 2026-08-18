import test from 'node:test';
import assert from 'node:assert/strict';

import { CATALOGO } from '../js/catalogo-data.js';

test('catalog uses the confirmed block foam prices', () => {
  const blockPrices = Object.fromEntries(
    CATALOGO
      .filter((item) => item.produto === 'Espuma em bloco')
      .map((item) => [item.especificacao, item.preco]),
  );

  assert.deepEqual(blockPrices, { D26: 890, D28: 1090, D33: 1190 });
});

test('catalog uses the confirmed laminated product prices', () => {
  const mantas = CATALOGO.find((item) => item.produto === 'Mantas laminadas');
  const cascao = CATALOGO.find((item) => item.produto === 'Cascão laminado em rolo');

  assert.equal(mantas.preco, 35);
  assert.equal(mantas.unidade, 'kg');
  assert.equal(cascao.preco, 15);
  assert.equal(cascao.unidade, 'kg');
});

test('other densities remain available by quote', () => {
  const otherDensities = CATALOGO.find((item) => item.produto === 'Outras densidades');

  assert.equal(otherDensities.preco, null);
  assert.match(otherDensities.mensagemWhatsApp, /orçamento/i);
});
