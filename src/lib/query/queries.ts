export const CART_QUERY_KEYS = {
  all: ['cart'] as const,
  list: () => [...CART_QUERY_KEYS.all, 'list'] as const,
};
