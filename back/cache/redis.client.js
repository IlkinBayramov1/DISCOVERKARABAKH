// Dummy Redis Stub to unblock imports until real Redis cluster is configured
export default {
    isReady: () => false,
    get: async (key) => null,
    setEx: async (key, ttl, value) => null,
    del: async (key) => null,
    on: (event, handler) => { }
};
