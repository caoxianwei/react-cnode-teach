import { observable, computed, action } from 'mobx';

export default class AppState {
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
  // 服务端渲染时候，将appState的实例在服务端渲染完成之后，得到的数据，以json的方式拿到
  // 之后将这个新的数据，以某种办法，让客户端拿到
  toJson() {
    return {
      count: this.count,
      name: this.name,
    }
  }
}

