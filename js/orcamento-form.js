import { buildWhatsAppLink } from './utils.js';

export const ORCAMENTO_WHATSAPP_NUMBER = '5543984888884';

function normalizeValue(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

export function validateOrcamentoValues(values = {}) {
  const errors = {};

  if (!normalizeValue(values.nome)) {
    errors.nome = 'Digite seu nome.';
  }

  if (!normalizeValue(values.cidade)) {
    errors.cidade = 'Digite sua cidade.';
  }

  if (!normalizeValue(values.produto)) {
    errors.produto = 'Selecione um produto.';
  }

  return errors;
}

export function buildOrcamentoMessage(values = {}) {
  const nome = normalizeValue(values.nome);
  const cidade = normalizeValue(values.cidade);
  const produto = normalizeValue(values.produto);
  const detalhes = normalizeValue(values.detalhes);
  const lines = [
    'Olá! Vim pelo site da Rocha Decor Espumas e gostaria de solicitar um orçamento.',
    '',
    'Nome: ' + nome,
    'Cidade: ' + cidade,
    'Produto: ' + produto,
  ];

  if (detalhes) {
    lines.push('Medidas ou quantidade: ' + detalhes);
  }

  return lines.join('\n');
}

export function buildOrcamentoWhatsAppLink(values) {
  return buildWhatsAppLink(
    ORCAMENTO_WHATSAPP_NUMBER,
    buildOrcamentoMessage(values),
  );
}

export function initOrcamentoForm(selector = '#orcamento-form') {
  const form = document.querySelector(selector);
  if (!form) return;

  form.addEventListener('input', (event) => {
    if (typeof event.target?.setCustomValidity === 'function') {
      event.target.setCustomValidity('');
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const values = {
      nome: formData.get('nome'),
      cidade: formData.get('cidade'),
      produto: formData.get('produto'),
      detalhes: formData.get('detalhes'),
    };
    const errors = validateOrcamentoValues(values);

    ['nome', 'cidade', 'produto'].forEach((fieldName) => {
      const field = form.elements.namedItem(fieldName);
      if (typeof field?.setCustomValidity === 'function') {
        field.setCustomValidity(errors[fieldName] ?? '');
      }
    });

    if (Object.keys(errors).length) {
      form.reportValidity();
      return;
    }

    if (!form.reportValidity()) return;

    window.open(
      buildOrcamentoWhatsAppLink(values),
      '_blank',
      'noopener,noreferrer',
    );
  });
}
