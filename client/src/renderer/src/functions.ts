const api = new Proxy(
  {},
  {
    get(_target, prop: string) {
      return async (...args: any[]) => await window.api.function(prop, ...args);
    },
  }
);

export default api;
