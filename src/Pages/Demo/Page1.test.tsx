import React from 'react';
import renderer from 'react-test-renderer';
import Page1 from './Page1';

test('Page1 rendor correctly', () => {
  const app = {
    url: '',
    urlQuery: '',
  };
  const tree = renderer.create(<Page1 app={app} />).toJSON();
  expect(tree).toMatchSnapshot();
});
