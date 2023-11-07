import { paramsToObject } from '../paramsToObject';

describe('transformParams', () => {
  it('should transform simple string', () => {
    expect(paramsToObject('analytics=false')).toEqual({ analytics: 'false' });
    expect(paramsToObject('ruleContexts=mobile')).toEqual({ ruleContexts: 'mobile' });
    expect(paramsToObject('hitsPerPage=50')).toEqual({ hitsPerPage: '50' });
    expect(paramsToObject('tagFilters=')).toEqual({ tagFilters: '' });
  });

  it('should transform simple string with encoding', () => {
    expect(paramsToObject('snippetEllipsisText=%E2%80%A6')).toEqual({ snippetEllipsisText: '…' });
    expect(paramsToObject('attributesToRetrieve=%5B%22*%22%5D')).toEqual({
      attributesToRetrieve: '["*"]',
    });
    expect(paramsToObject('attributesToSnippet=%5B%22*%3A20%22%5D')).toEqual({
      attributesToSnippet: '["*:20"]',
    });
    expect(paramsToObject('highlightPreTag=%3Cais-highlight-0%3E')).toEqual({
      highlightPreTag: '<ais-highlight-0>',
    });
    expect(paramsToObject('highlightPostTag=%3C%2Fais-highlight-0%3E')).toEqual({
      highlightPostTag: '</ais-highlight-0>',
    });
    expect(
      paramsToObject('ruleContexts=%5B%222023-q2-sale%22%2C%22good-context%22%2C%22mobile%22%5D'),
    ).toEqual({ ruleContexts: '["2023-q2-sale","good-context","mobile"]' });
  });

  it('should transform strings with multiple parameters', () => {
    expect(
      paramsToObject('analytics=false&ruleContexts=mobile&hitsPerPage=50&tagFilters='),
    ).toEqual({
      analytics: 'false',
      ruleContexts: 'mobile',
      hitsPerPage: '50',
      tagFilters: '',
    });
  });

  it('should transform string with encoding & with multiple parameters', () => {
    expect(
      paramsToObject(
        'analytics=false&hitsPerPage=50&attributesToRetrieve=%5B%22*%22%5D&attributesToSnippet=%5B%22*%3A20%22%5D&highlightPreTag=%3Cais-highlight-0%3E&highlightPostTag=%3C%2Fais-highlight-0%3E&ruleContexts=%5B%222023-q2-sale%22%2C%22good-context%22%2C%22mobile%22%5D&tagFilters=',
      ),
    ).toEqual({
      analytics: 'false',
      hitsPerPage: '50',
      attributesToRetrieve: '["*"]',
      attributesToSnippet: '["*:20"]',
      highlightPreTag: '<ais-highlight-0>',
      highlightPostTag: '</ais-highlight-0>',
      ruleContexts: '["2023-q2-sale","good-context","mobile"]',
      tagFilters: '',
    });
  });

  it('should parse rulesAtQueryTime', () => {
    expect(
      paramsToObject(
        'rulesAtQueryTime=%5B%7B%22conditions%22%3A%5B%5D%2C%22consequence%22%3A%7B%22filterPromotes%22%3Atrue%7D%7D%5D',
      ),
    ).toEqual({
      rulesAtQueryTime: [
        {
          conditions: [],
          consequence: { filterPromotes: true },
        },
      ],
    });
  });
});

// rulesAtQueryTime=%5B%7B%22objectID%22%3A%22qr-1699266480536%22%2C%22enabled%22%3Afalse%2C%22conditions%22%3A%5B%5D%2C%22consequence%22%3A%7B%22filterPromotes%22%3Atrue%7D%7D%5D
