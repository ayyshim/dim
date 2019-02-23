import React, { Component } from "react";
import { Button, List, Tooltip, Col, Row, Dropdown, Icon, Comment, Input } from "antd";
import { connect } from "react-redux";
import moment from "moment";
import { Chat } from "../../Store/Actions/chatAction";


class MainChatArea extends Component {
  state = {};

  onClick = () => {
    const details = {
      message: this.state.message,
      s_id: this.props.firebase.uid,
      s_dn : this.props.firebase.displayName,
      g_id: this.props.runningDiscussion
    };
    this.props.send_message(details);
    this.setState({
      message: ""
    });
  };

  onChangeMessage = e => {
    this.setState({
      message: e.target.value
    });
  };

 
  render() {
    console.log(this.props.firebase)
    return (
      <Col span={18}>
        {this.props.group && (<Row id="message-box" className="up">
          <Col span={10}>
            <div id="grp-name">
              {this.props.group && this.props.group.name}{" "}
              {this.props.problem.problem_title === undefined
                ? ""
                : `> ${this.props.problem.problem_title}`}
            </div>
          </Col>

          <Col span={14} id="grp-icon"> 
          <Input type="text" placeholder="Username" id="inputta"/>
          <Button type="primary">Add User</Button> <Button>Share Code</Button>
            <Dropdown overlay={this.props.menu}>
              <a className="ant-dropdown-link" href="#">
                <Icon type="meh" />
              </a>
            </Dropdown>
          </Col>
        </Row>)}

        <Row id="chat-box" className="up">
          {this.props.group && (
            <List
              className="comment-list"
              itemLayout="horizontal"
              dataSource={this.props.list_message}
              renderItem={item => (
                <Comment
                  id="chat"
                  author={<b>{this.props.firebase.uid === item.s_id ? "YOU" : item.s_dn}</b>}
                  content={<p>{item.message}</p>}
                  datetime={
                    <Tooltip
                      title={moment()
                        .subtract(item.createAt, "days")
                        .format("YYYY-MM-DD HH:mm:ss")}
                    >
                      <span>
                        {moment()
                          .subtract(item.createAt)
                          .fromNow()}
                      </span>
                    </Tooltip>
                  }
                />
              )}
            />
          )}
        </Row>
        <br />
        <Row>
          <Col span={4} />
          <Col span={16}>
            <div>
              {this.props.group && (
                <Row>
                  <Col span={14}>
                    <Input
                      onChange={this.onChangeMessage}
                      placeholder="Type Message"
                      id="txt"
                      value={this.state.message}
                    />
                  </Col>
                  <Col span={8} offset={2}>
                    <Button onClick={this.onClick} type="primary" id="send-btn">
                      Send <Icon type="cloud-upload" />
                    </Button>
                  </Col>
                </Row>
              )}
            </div>
          </Col>
          <Col span={4} />
        </Row>
      </Col>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const key = ownProps.runningDiscussion;
  const groups = state.firestore.data.groups;
  const group = groups ? groups[key] : null;
  const members =
    state.firestore.ordered.members &&
    state.firestore.ordered.members.filter(m => {
      return m.g_id === key;
    });
  console.log(members);
  const messages = state.firestore.ordered.messages;
  const list_message =
    messages &&
    messages.filter(msg => {
      return msg.g_id === key;
    });
    
  return {
    firebase: state.firebase.auth,
    firestore: state.firestore,
    group,
    members,
    problem: state.problem.problem,
    list_message
  };
};

const mapDispatchToProps = dispatch => {
  return {
    send_message: detail => dispatch(Chat(detail))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainChatArea);
