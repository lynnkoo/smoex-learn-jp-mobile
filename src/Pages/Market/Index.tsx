import React from 'react';
import { IBasePageProps, LoadingView } from '@ctrip/crn';
import CPage from '../../Components/App/CPage';

export interface PropsType extends IBasePageProps {
  landingto: string,
  loadMarket: Function,
  getPageId: () => string,
}

class Market extends CPage<PropsType, any> {
  /* eslint-disable class-methods-use-this */
  getPageId() {
    return 'Market';
  }

  componentDidMount() {
    this.props.loadMarket();
  }

  componentDidUpdate() {
    this.renderComponent();
  }

  renderComponent = () => {
    const { landingto } = this.props;
    if (landingto) {
      this.replace(landingto);
    }
  }

  render() {
    return (<LoadingView />);
  }
}

export default Market;
