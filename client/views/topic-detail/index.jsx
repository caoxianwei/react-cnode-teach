import React, { Component } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import Helmet from 'react-helmet';
import { observer, inject } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { CircularProgress } from 'material-ui/Progress';
import Container from '../layout/container';
import { topicDetailStyle } from './styles';
import TopicStore from '../../store/topic-store';
import Reply from './reply';

@inject((stores) => {
  return {
    topicStore: stores.topicStore,
    appState: stores.appState,
  }
}) @observer
class TopicDetail extends Component {
  // static contextTypes = {
  //   router: PropTypes.object,
  // }

  // constructor() {
  //   super();
  // }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.topicStore.getTopicDetail(id);
  }

  render() {
    const { classes } = this.props;
    const id = this.props.match.params.id;
    const topic = this.props.topicStore.detailMap[id];
    if (!topic) {
      return (
        <Container>
          <section className={classes.loadingContainer}>
            <CircularProgress color="accent" />
          </section>
        </Container>
      )
    }

    return (
      <div>
        <Container>
          <Helmet>
            <title>{topic.title}</title>
          </Helmet>
          <header className={classes.header}>
            <h3>{topic.title}</h3>
          </header>
          <section className={classes.body}>
            <p dangerouslySetInnerHTML={{ __html: marked(topic.content) }} />
          </section>
        </Container>

        <Paper elevation={4} className={classes.replies}>
          <header className={classes.replyHeader}>
            <span>{`${topic.reply_count} 回复`}</span>
            <span>{`最新回复 ${topic.last_reply_at} `}</span>
          </header>
          <section>
            {
              topic.replies.map((reply) => {
                return (
                  <Reply reply={reply} key={reply.id} />
                )
              })
            }
          </section>
        </Paper>
      </div>
    );
  }
}

TopicDetail.wrappedComponent.propTypes = {
  // appState: PropTypes.object.isRequired,
  topicStore: PropTypes.instanceOf(TopicStore).isRequired,
}

TopicDetail.propTypes = {
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(topicDetailStyle)(TopicDetail);
