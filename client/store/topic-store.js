import { observable, action, extendObservable, computed } from 'mobx';
import { topicSchema, replySchema } from '../util/variable-define';
import { get, post } from '../util/http';

// 让topic数据包含所有的字段
const createTopic = (topic) => {
  return Object.assign({}, topicSchema, topic);
}

const createReply = (reply) => {
  return Object.assign({}, replySchema, reply);
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
  @observable createdReplies = [];
  @action doReply(content) {
    return new Promise((resolve, reject) => {
      post(`topic/${this.id}/replies`, {
        needAccessToken: true,
      }, { content })
        .then((resp) => {
          if (resp.success) {
            this.createdReplies.push(createReply({
              id: resp.data.reply_id,
              content,
              create_at: Date.now(),
            }));
            resolve();
          } else {
            reject(resp);
          }
        }).catch((err) => {
          reject(err);
        })
    })
  }
}

class TopicStore {
  @observable topics;
  @observable details;
  @observable syncing;

  constructor({ syncing = false, topics = [], details = [] } = {}) {
    this.syncing = syncing;
    this.topics = topics.map((topic) => {
      return new Topic(createTopic(topic));
    });
    this.details = details.map((detail) => {
      return new Topic(createTopic(detail));
    })
  }

  addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)));
  }

  @computed get detailMap() {
    return this.details.reduce((result, detail) => {
      result[detail.id] = detail;
      return result;
    }, {})
  }

  @action fetchTopics(tab) {
    return new Promise((resolve, reject) => {
      this.topics = [];
      this.syncing = true;
      get('topics', {
        // 是否需要将mk字符串渲染成html字符串
        mdrender: false,
        tab,
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

  @action getTopicDetail(id) {
    return new Promise((resolve, reject) => {
      if (this.detailMap[id]) {
        resolve(this.detailMap[id]);
      } else {
        get(`topic/${id}`, {
          mdrender: false,
        }).then((resp) => {
          if (resp.success) {
            const topic = new Topic(createTopic(resp.data));
            this.details.push(topic);
            resolve(topic);
          } else {
            reject();
          }
        }).catch(reject);
      }
    })
  }
}

export default TopicStore;
