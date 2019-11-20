import BuildTime from '../BuildTime';

class AppContext {
  static MarketInfo = {};

  static QConfig = {};

  static Cache = {};

  static CarEnv = { BuildTime, AppType: '' };

  static SharkKeys = {};
}

export default AppContext;
