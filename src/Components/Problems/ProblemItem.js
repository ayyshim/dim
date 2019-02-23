import React, { Component } from 'react';
import { Drawer, Button, Icon, Popover } from "antd";
import firebase from '../../Configs/firebaseConfig'
import Test from '../Screens/test'

class ProblemItem extends Component {
  state = { visible: false };


  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  state = { 
    url: ""
   }

  onGetLink = () => firebase.storage()
      .ref(`problems/${this.props.problem.g_id}`)
      .child(this.props.problem.filename)
      .getDownloadURL()
      .then(url => {this.setState({url})})
  
  componentDidMount() {
    this.onGetLink()
  }
   

  render() { 
    return ( 
        <Popover
          placement="topLeft"
          title={this.props.problem.by}
          content={
            <div>
              <p onClick={this.showDrawer}>{this.props.problem.filename}</p>
              <Drawer
          title="Code Editor" width={720} height={500}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible} style={{
            overflow: 'auto',
            height: 'calc(100% - 108px)',
            paddingBottom: '108px',
          }}>

          
            <Test/>
           
</Drawer>
       
              <a type="primary" href={this.state.url} id="dwn">
                <Icon type="download" /> Download
              </a>
            </div>
          }
          trigger="click"
        >
          <Button id="right-panel">
            {this.props.index === 0 ? `Problem submitted` : "Revision " + this.props.index}
          </Button>
        </Popover>
     );
  }
}
 

export default ProblemItem;
