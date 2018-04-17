import { observable, computed, action } from 'mobx';

export class AppState {
  @observable count = 0;
  @observable name = 'gsp';
  @computed get msg() {
    return `${this.name} say count is ${this.count}`;
  }
  @action add() {
    this.count += 1;
  }
  @action changeName(name) {
    this.name = name;
  }
}

const appState = new AppState();

// 直接export出去一个实例
export default appState;
