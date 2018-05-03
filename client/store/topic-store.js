import { observable, action, extendObservable } from 'mobx';
import { topicSchema } from '../util/variable-define';
import { get } from '../util/http';

// 让topic数据包含所有的字段
const createTopic = (topic) => {
  return Object.assign({}, topicSchema, topic);
}

// 再创建一个topic的类，让后面的类更加灵活
class Topic {
  constructor(data) {
    // 这样才能让，附加的这些值，都是实时同步dom的
    // 这样的话，这些附件的数据，才也会变成reactive,
    // 如果不这样的话，页面使用这些数据的话，组件里面的值不会被更新
    extendObservable(this, data);
  }

  @observable syncing = false;
}

class TopicStore {
  @observable topics;
  @observable syncing;

  constructor({ syncing, topics } = { syncing: false, topics: [] }) {
    this.syncing = syncing;
    this.topics = topics.map((topic) => {
      return new Topic(createTopic(topic));
    });
  }

  addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)));
  }

  @action fetchTopics() {
    return new Promise((resolve, reject) => {
      this.topics = [];
      this.syncing = true;
      get('topics', {
        // 是否需要将mk字符串渲染成html字符串
        mdrender: false,
      }).then((resp) => {
        if (resp.success) {
          resp.data.forEach((topic) => {
            this.addTopic(topic);
          });
          resolve();
        } else {
          reject();
        }
        this.syncing = false;
      }).catch((err) => {
        reject(err);
        this.syncing = false;
      })
    })
  }
}

export default TopicStore;
