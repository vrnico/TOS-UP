// Simple reactive state store
const Store = {
  _state: {
    companies: [],
    articles: [],
    glossary: [],
    stats: null,
    currentCompany: null,
    currentArticle: null,
    searchQuery: '',
    searchResults: null,
    filters: {
      category: 'all',
      risk: 'all',
      sort: 'risk-desc',
    },
    compareSelection: [],
    loading: false,
    error: null,
  },

  _listeners: [],

  get(key) {
    return this._state[key];
  },

  set(key, value) {
    this._state[key] = value;
    this._notify(key);
  },

  update(updates) {
    for (const [key, value] of Object.entries(updates)) {
      this._state[key] = value;
    }
    this._notify(Object.keys(updates));
  },

  subscribe(fn) {
    this._listeners.push(fn);
    return () => {
      this._listeners = this._listeners.filter(l => l !== fn);
    };
  },

  _notify(keys) {
    for (const fn of this._listeners) {
      fn(this._state, Array.isArray(keys) ? keys : [keys]);
    }
  },
};
