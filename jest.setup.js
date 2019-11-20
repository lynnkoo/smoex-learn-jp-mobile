/* eslint-disable */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React, { Component } from 'react';
import { View } from 'react-native';
import { HeaderView } from '@ctrip/crn';

configure({ adapter: new Adapter() });

jest.useFakeTimers();

jest.mock('@ctrip/crn', () => {

  const react = require('react');

  return {
    Page: react.Component,
    ViewPort: () => {
      return props => {
        return <View {...props}>{props && props.children}</View>;
      };
    },
  };
});
