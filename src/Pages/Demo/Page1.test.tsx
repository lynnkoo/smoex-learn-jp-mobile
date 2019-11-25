import React from 'react';
import renderer from 'react-test-renderer';
import Page1 from './Page1';

test('Page1 rendor correctly', () => {
  const tree = renderer.create(<Page1 />).toJSON();
  expect(tree).toMatchSnapshot();
});
