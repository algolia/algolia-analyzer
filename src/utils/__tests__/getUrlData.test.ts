import { getUrlData } from '../getUrlData';

describe('getUrlData', () => {
  describe('search', () => {
    it('/indexes/*/top', () => {
      expect(getUrlData(new URL('https://f4t6cuv2ah.algolia.net/1/indexes/*/top'))).toEqual({
        api: 'search',
        cluster: 'f4t6cuv2ah',
        apiSubPath: 'top',
        index: '*',
        queryStringParameters: {},
        displayableUrl: 'f4t6cuv2ah.algolia.net/1/indexes/*/top',
      });
    });

    it('/indexes', () => {
      expect(
        getUrlData(new URL('https://f4t6cuv2ah.algolia.net/1/indexes?prefix=products&page=0')),
      ).toEqual({
        api: 'search',
        cluster: 'f4t6cuv2ah',
        apiSubPath: 'indexes',
        index: null,
        queryStringParameters: { prefix: 'products', page: '0' },
        displayableUrl: 'f4t6cuv2ah.algolia.net/1/indexes',
      });
    });

    it('/indexes/*/queries', () => {
      expect(getUrlData(new URL('https://f4t6cuv2ah.algolia.net/1/indexes/*/queries'))).toEqual({
        api: 'search',
        cluster: 'f4t6cuv2ah',
        apiSubPath: 'queries',
        index: '*',
        queryStringParameters: {},
        displayableUrl: 'f4t6cuv2ah.algolia.net/1/indexes/*/queries',
      });
    });

    it('/indexes/*/rules/search', () => {
      expect(
        getUrlData(new URL('https://f4t6cuv2ah.algolia.net/1/indexes/products/rules/search')),
      ).toEqual({
        api: 'search',
        cluster: 'f4t6cuv2ah',
        apiSubPath: 'rules/search',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 'f4t6cuv2ah.algolia.net/1/indexes/products/rules/search',
      });
    });

    it('/indexes/*/rules/{id}', () => {
      expect(
        getUrlData(
          new URL('https://f4t6cuv2ah.algolia.net/1/indexes/products/rules/qr-1676451640489'),
        ),
      ).toEqual({
        api: 'search',
        cluster: 'f4t6cuv2ah',
        apiSubPath: 'rules/{id}',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 'f4t6cuv2ah.algolia.net/1/indexes/products/rules/qr-1676451640489',
      });
    });

    it('indexes/*/synonyms/search', () => {
      expect(
        getUrlData(new URL('https://f4t6cuv2ah.algolia.net/1/indexes/products/synonyms/search')),
      ).toEqual({
        api: 'search',
        cluster: 'f4t6cuv2ah',
        apiSubPath: 'synonyms/search',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 'f4t6cuv2ah.algolia.net/1/indexes/products/synonyms/search',
      });
    });

    it('indexes/settings', () => {
      expect(
        getUrlData(new URL('https://f4t6cuv2ah.algolia.net/1/indexes/products/settings')),
      ).toEqual({
        api: 'search',
        cluster: 'f4t6cuv2ah',
        apiSubPath: 'settings',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 'f4t6cuv2ah.algolia.net/1/indexes/products/settings',
      });
    });

    it('/indexes/*/task/{id}', () => {
      expect(
        getUrlData(new URL('https://f4t6cuv2ah.algolia.net/1/indexes/products/task/5260335001')),
      ).toEqual({
        api: 'search',
        cluster: 'f4t6cuv2ah',
        apiSubPath: 'task/{id}',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 'f4t6cuv2ah.algolia.net/1/indexes/products/task/5260335001',
      });
    });
  });

  describe('analytics', () => {
    it('/tags', () => {
      expect(
        getUrlData(
          new URL(
            'https://analytics.de.algolia.com/2/tags?index=products&limit=1000&startDate=2023-06-26&endDate=2023-07-02',
          ),
        ),
      ).toEqual({
        api: 'analytics',
        cluster: 'de',
        apiSubPath: 'tags',
        index: 'products',
        queryStringParameters: {
          index: 'products',
          limit: '1000',
          startDate: '2023-06-26',
          endDate: '2023-07-02',
        },
        displayableUrl: 'analytics.de.algolia.com/2/tags',
      });
    });

    it('/status', () => {
      expect(
        getUrlData(new URL('https://analytics.de.algolia.com/2/status?index=products')),
      ).toEqual({
        api: 'analytics',
        cluster: 'de',
        apiSubPath: 'status',
        index: 'products',
        queryStringParameters: { index: 'products' },
        displayableUrl: 'analytics.de.algolia.com/2/status',
      });
    });

    it('/categories/count (unstable)', () => {
      expect(
        getUrlData(
          new URL(
            'https://analytics.de.algolia.com/unstable/categories/count?index=products&filterAttributes=categories&startDate=2023-06-26&endDate=2023-07-02',
          ),
        ),
      ).toEqual({
        api: 'analytics',
        cluster: 'de',
        apiSubPath: 'categories/count',
        index: 'products',
        queryStringParameters: {
          index: 'products',
          filterAttributes: 'categories',
          startDate: '2023-06-26',
          endDate: '2023-07-02',
        },
        displayableUrl: 'analytics.de.algolia.com/unstable/categories/count',
      });
    });

    it('/categories (unstable)', () => {
      expect(
        getUrlData(
          new URL(
            'https://analytics.de.algolia.com/unstable/categories?index=products&clickAnalytics=true&limit=1000&category.attribute=categories&orderBy=searchCount&direction=desc&startDate=2023-06-26&endDate=2023-07-02',
          ),
        ),
      ).toEqual({
        api: 'analytics',
        cluster: 'de',
        apiSubPath: 'categories',
        index: 'products',
        queryStringParameters: {
          index: 'products',
          clickAnalytics: 'true',
          limit: '1000',
          'category.attribute': 'categories',
          orderBy: 'searchCount',
          direction: 'desc',
          startDate: '2023-06-26',
          endDate: '2023-07-02',
        },
        displayableUrl: 'analytics.de.algolia.com/unstable/categories',
      });
    });

    it('/abtests', () => {
      expect(getUrlData(new URL('https://analytics.de.algolia.com/2/abtests'))).toEqual({
        api: 'analytics',
        cluster: 'de',
        apiSubPath: 'abtests',
        index: null,
        queryStringParameters: {},
        displayableUrl: 'analytics.de.algolia.com/2/abtests',
      });
    });
  });

  describe('query categorization', () => {
    it('/predictions-bins', () => {
      expect(
        getUrlData(new URL('https://query-categorization.de.algolia.com/1/predictions-bins')),
      ).toEqual({
        api: 'query-categorization',
        cluster: 'de',
        apiSubPath: 'predictions-bins',
        index: null,
        queryStringParameters: {},
        displayableUrl: 'query-categorization.de.algolia.com/1/predictions-bins',
      });
    });

    it('/configs', () => {
      expect(getUrlData(new URL('https://query-categorization.de.algolia.com/1/configs'))).toEqual({
        api: 'query-categorization',
        cluster: 'de',
        apiSubPath: 'configs',
        index: null,
        queryStringParameters: {},
        displayableUrl: 'query-categorization.de.algolia.com/1/configs',
      });
    });

    it('/status/*', () => {
      expect(
        getUrlData(new URL('https://query-categorization.de.algolia.com/1/status/products')),
      ).toEqual({
        api: 'query-categorization',
        cluster: 'de',
        apiSubPath: 'status',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 'query-categorization.de.algolia.com/1/status/products',
      });
    });

    it('/taxonomy/*', () => {
      expect(
        getUrlData(new URL('https://query-categorization.de.algolia.com/1/taxonomy/products')),
      ).toEqual({
        api: 'query-categorization',
        cluster: 'de',
        apiSubPath: 'taxonomy',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 'query-categorization.de.algolia.com/1/taxonomy/products',
      });
    });
  });

  describe('re-ranking', () => {
    it('/configs', () => {
      expect(getUrlData(new URL('https://re-ranking.de.algolia.com/1/configs'))).toEqual({
        api: 're-ranking',
        cluster: 'de',
        apiSubPath: 'configs',
        index: null,
        queryStringParameters: {},
        displayableUrl: 're-ranking.de.algolia.com/1/configs',
      });
    });

    it('/metadata/*', () => {
      expect(getUrlData(new URL('https://re-ranking.de.algolia.com/1/metadata/products'))).toEqual({
        api: 're-ranking',
        cluster: 'de',
        apiSubPath: 'metadata',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 're-ranking.de.algolia.com/1/metadata/products',
      });
    });

    it('/hitsinfo/*', () => {
      expect(getUrlData(new URL('https://re-ranking.de.algolia.com/1/hitsinfo/products'))).toEqual({
        api: 're-ranking',
        cluster: 'de',
        apiSubPath: 'hitsinfo',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 're-ranking.de.algolia.com/1/hitsinfo/products',
      });
    });

    it('/queries/*', () => {
      expect(getUrlData(new URL('https://re-ranking.de.algolia.com/1/queries/products'))).toEqual({
        api: 're-ranking',
        cluster: 'de',
        apiSubPath: 'queries',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 're-ranking.de.algolia.com/1/queries/products',
      });
    });
  });

  describe('merchandising', () => {
    it('/indexes/*/custom-rankings', () => {
      expect(
        getUrlData(
          new URL(
            'https://merchandising-staging.de.algolia.com/merchandising/1/indexes/products/custom-rankings',
          ),
        ),
      ).toEqual({
        api: 'merchandising',
        cluster: 'staging',
        apiSubPath: 'indexes/custom-rankings',
        index: 'products',
        queryStringParameters: {},
        displayableUrl:
          'merchandising-staging.de.algolia.com/merchandising/1/indexes/products/custom-rankings',
      });
    });
  });

  describe('automation', () => {
    it('/indices', () => {
      expect(getUrlData(new URL('https://automation.de.algolia.com/1/indices'))).toEqual({
        api: 'automation',
        cluster: 'de',
        apiSubPath: 'indices',
        index: null,
        queryStringParameters: {},
        displayableUrl: 'automation.de.algolia.com/1/indices',
      });
    });

    it('/synonyms/*/count', () => {
      expect(
        getUrlData(new URL('https://automation.de.algolia.com/1/synonyms/products/count')),
      ).toEqual({
        api: 'automation',
        cluster: 'de',
        apiSubPath: 'synonyms/count',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 'automation.de.algolia.com/1/synonyms/products/count',
      });
    });

    it('/synonyms/*', () => {
      expect(
        getUrlData(new URL('https://automation.de.algolia.com/1/synonyms/products?status=pending')),
      ).toEqual({
        api: 'automation',
        cluster: 'de',
        apiSubPath: 'synonyms',
        index: 'products',
        queryStringParameters: { status: 'pending' },
        displayableUrl: 'automation.de.algolia.com/1/synonyms/products',
      });
    });
  });

  describe('insights', () => {
    it('/metrics', () => {
      expect(
        getUrlData(
          new URL(
            'https://insights.de.algolia.io/1/metrics?startDate=2023-04-06T00:00:00.000Z&endDate=2023-07-04T23:59:59.999Z&granularity=day&index=products',
          ),
        ),
      ).toEqual({
        api: 'insights',
        cluster: 'de',
        apiSubPath: 'metrics',
        index: 'products',
        queryStringParameters: {
          startDate: '2023-04-06T00:00:00.000Z',
          endDate: '2023-07-04T23:59:59.999Z',
          granularity: 'day',
          index: 'products',
        },
        displayableUrl: 'insights.de.algolia.io/1/metrics',
      });
    });
  });

  describe('neural perso', () => {
    it('/config', () => {
      expect(getUrlData(new URL('https://neuralperso.eu.algolia.com/1/config'))).toEqual({
        api: 'neuralperso',
        cluster: 'eu',
        apiSubPath: 'config',
        index: null,
        queryStringParameters: {},
        displayableUrl: 'neuralperso.eu.algolia.com/1/config',
      });
    });

    it('/users', () => {
      expect(getUrlData(new URL('https://neuralperso.eu.algolia.com/1/users?limit=10'))).toEqual({
        api: 'neuralperso',
        cluster: 'eu',
        apiSubPath: 'users',
        index: null,
        queryStringParameters: { limit: '10' },
        displayableUrl: 'neuralperso.eu.algolia.com/1/users',
      });
    });

    it('/users/*', () => {
      expect(getUrlData(new URL('https://neuralperso.eu.algolia.com/1/users/products'))).toEqual({
        api: 'neuralperso',
        cluster: 'eu',
        apiSubPath: 'users',
        index: 'products',
        queryStringParameters: {},
        displayableUrl: 'neuralperso.eu.algolia.com/1/users/products',
      });
    });
  });
});
