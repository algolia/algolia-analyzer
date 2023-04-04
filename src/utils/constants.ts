export const urlPattern = new URLPattern({
  hostname: '{*.}(algolianet.com|algolia.net)',
});
export const urlPattern2 = new URLPattern({
  hostname: '(merchandising-staging|analytics).*.algolia.com',
});
export const requestHeaderFilter = 'x-algolia-';
