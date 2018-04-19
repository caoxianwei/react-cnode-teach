import AppStateClass from './app-state';

export const AppState = AppStateClass;

export default {
  AppState,
};

// 这个函数是专门，用来给服务端渲染用的
export const createStoreMap = () => {
  const obj = {
    appState: new AppState(),
  };
  return obj;
}
