import { CATALOGO } from './catalogo-data.js';
import { buildWhatsAppLink, formatPrice } from './utils.js';

const WHATSAPP_NUMBER = '5543984888884';

function createCell(text, label, className = '') {
  const cell = document.createElement('td');
  cell.dataset.label = label;
  cell.className = className;
  cell.textContent = text;
  return cell;
}

function createProductCell(text) {
  const cell = document.createElement('th');
  cell.scope = 'row';
  cell.dataset.label = 'Produto';
  cell.className = 'price-table__product';
  cell.textContent = text;
  return cell;
}

function createPriceRow(item) {
  const row = document.createElement('tr');
  row.className = 'price-table__row';

  if (item.preco === null) {
    row.classList.add('price-table__row--quote');
  }

  if (item.produto === 'Espuma em bloco') {
    row.classList.add('price-table__row--foam');
  }

  const product = createProductCell(item.produto);
  const specification = createCell(item.especificacao, 'Especificação', 'price-table__specification');
  const unit = createCell(item.unidade ?? '—', 'Unidade', 'price-table__unit');
  const price = createCell(
    item.preco === null ? 'Sob consulta' : formatPrice(item.preco),
    'Preço',
    'price-table__price',
  );

  const action = document.createElement('td');
  action.dataset.label = 'Ação';
  action.className = 'price-table__action';

  const cta = document.createElement('a');
  cta.className = 'btn btn--secondary btn--small price-table__cta';
  cta.href = buildWhatsAppLink(WHATSAPP_NUMBER, item.mensagemWhatsApp);
  cta.target = '_blank';
  cta.rel = 'noopener';
  cta.textContent = item.preco === null ? 'Solicitar orçamento' : 'Consultar';
  cta.setAttribute('aria-label', `${cta.textContent}: ${item.produto} ${item.especificacao}`);

  action.appendChild(cta);
  row.append(product, specification, unit, price, action);
  return row;
}

export function renderCatalogo(selector = '#catalogo-table-body') {
  const tableBody = document.querySelector(selector);
  if (!tableBody) return;

  const fragment = document.createDocumentFragment();
  CATALOGO.forEach((item) => fragment.appendChild(createPriceRow(item)));
  tableBody.replaceChildren(fragment);
}
