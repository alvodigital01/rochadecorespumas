import { CATALOGO } from './catalogo-data.js';
import { buildWhatsAppLink, formatPriceRange } from './utils.js';

const WHATSAPP_NUMBER = '5543984888884';

function createCatalogCard(item) {
  const card = document.createElement('article');
  card.className = 'catalog-card';
  card.setAttribute('data-reveal', '');

  const title = document.createElement('h3');
  title.className = 'catalog-card__title';
  title.textContent = item.densidade;

  const uso = document.createElement('p');
  uso.className = 'catalog-card__uso';
  uso.textContent = item.uso;

  const preco = document.createElement('p');
  preco.className = 'catalog-card__preco';
  preco.textContent = formatPriceRange(item.precoMin, item.precoMax, item.unidade);

  const cta = document.createElement('a');
  cta.className = 'btn btn--secondary btn--small catalog-card__cta';
  cta.href = buildWhatsAppLink(WHATSAPP_NUMBER, item.mensagemWhatsApp);
  cta.target = '_blank';
  cta.rel = 'noopener';
  cta.textContent = 'Consultar no WhatsApp';

  card.append(title, uso, preco, cta);

  return card;
}

export function renderCatalogo(selector = '#catalogo-grid') {
  const grid = document.querySelector(selector);
  if (!grid) return;

  const fragment = document.createDocumentFragment();
  CATALOGO.forEach((item) => {
    fragment.appendChild(createCatalogCard(item));
  });

  grid.appendChild(fragment);
}
