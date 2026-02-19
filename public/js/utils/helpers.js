// DOM helpers
function $(selector, parent = document) {
  return parent.querySelector(selector);
}

function $$(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') el.className = value;
    else if (key === 'innerHTML') el.innerHTML = value;
    else if (key === 'textContent') el.textContent = value;
    else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), value);
    else el.setAttribute(key, value);
  }
  for (const child of children) {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child) el.appendChild(child);
  }
  return el;
}

// Formatting
function formatNumber(n) {
  return Number(n).toLocaleString();
}

function riskColor(risk) {
  const map = { critical: 'var(--risk-critical)', high: 'var(--risk-high)', medium: 'var(--risk-medium)', low: 'var(--risk-low)' };
  return map[risk] || map.medium;
}

function riskClass(risk) {
  return `badge--risk-${risk}`;
}

function categoryClass(cat) {
  const map = {
    'Privacy': 'privacy', 'Legal Rights': 'legal', 'Content/IP': 'content',
    'Financial': 'financial', 'Account Control': 'account'
  };
  return `badge--${map[cat] || 'category'}`;
}

// Debounce
function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// Slug from text
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Escape HTML
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
