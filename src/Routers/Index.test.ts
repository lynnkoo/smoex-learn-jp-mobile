import Pages from './Index';

describe('Routers', () => {
  test('Contains at least one page', () => {
    expect(Pages.length).toBeGreaterThanOrEqual(1);
  });

  test('Should contains key [component] and [name]', () => {
    /* eslint-disable array-callback-return */
    Pages.map((page) => {
      const keys = Object.keys(page);
      const hasKey = keys.includes('component') && keys.includes('name');
      expect(hasKey).toBeTruthy();
    });
  });

  test('Page name should be unique', () => {
    const pageName = [];
    Pages.map((page) => {
      expect(pageName.includes(page.name)).toBeFalsy();
      pageName.push(page.name);
    });
  });
});
