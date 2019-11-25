import BuildTime from '../BuildTime';

export interface MarketInfoType {

}

export interface QConfigType {

}

export interface CacheType {

}

export interface CarEnvType {
  BuildTime: string,
  AppType: string,
}

export interface SharkKeysType {

}

class AppContext {
  static MarketInfo: MarketInfoType = {};

  static QConfig: QConfigType = {};

  static Cache: CacheType = {};

  static CarEnv: CarEnvType = { BuildTime, AppType: '' };

  static SharkKeys: SharkKeysType = {};
}

export default AppContext;
