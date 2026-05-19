// Local localStorage-based client replacing @base44/sdk

function createEntityService(entityName) {
  const key = `myvicroads_${entityName}`;
  const getAll = () => JSON.parse(localStorage.getItem(key) || "[]");
  const saveAll = (items) => localStorage.setItem(key, JSON.stringify(items));

  return {
    list: async () => getAll(),
    get: async (id) => getAll().find((i) => i.id === id),
    create: async (data) => {
      const items = getAll();
      const item = { ...data, id: crypto.randomUUID(), created_date: new Date().toISOString(), updated_date: new Date().toISOString() };
      items.push(item);
      saveAll(items);
      return item;
    },
    update: async (id, data) => {
      const items = getAll();
      const idx = items.findIndex((i) => i.id === id);
      if (idx >= 0) { items[idx] = { ...items[idx], ...data, updated_date: new Date().toISOString() }; saveAll(items); return items[idx]; }
      return null;
    },
    delete: async (id) => {
      const items = getAll().filter((i) => i.id !== id);
      saveAll(items);
    },
    filter: async (query) => {
      const items = getAll();
      return items.filter((item) => Object.entries(query).every(([k, v]) => item[k] === v));
    },
  };
}

const USER_KEY = "myvicroads_user";
const defaultUser = {
  full_name: "User",
  first_name: "User",
  email: "user@example.com",
};

export const base44 = {
  entities: new Proxy({}, { get: (_, name) => createEntityService(name) }),
  auth: {
    me: async () => {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    },
    updateMe: async (data) => {
      const current = JSON.parse(localStorage.getItem(USER_KEY) || JSON.stringify(defaultUser));
      const updated = { ...current, ...data };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    },
    logout: async () => { localStorage.removeItem(USER_KEY); },
    isAuthenticated: () => !!localStorage.getItem(USER_KEY),
  },
  integrations: {
    Core: {
      UploadFile: async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      },
    },
  },
};
