/* Copyright 2021 Nathan Drapeza
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *      http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
import React from "react";
import { List, Badge, NavBar, Icon } from "antd-mobile";
import { Button, Form, Input, message, Modal } from "antd";
import store from "../../store/store";
import "./index.css";
import { client } from "../../http";

const getPostNotifications = async () => {
  const current_user = store.getState().login.id;
  const result = await client.get(`inbox_posts/` + current_user);
  message.success("Sent a friend request!");
};

const Inbox = (props) => {
  return (
    <div className="inbox w1200">
      <h1>Follow Notifications:</h1>
      <List style={{ marginTop: 10 }}>
        <List.Item extra="12:00" arrow="horizontal">
          <Badge dot>
            <img
              style={{ height: "100%", borderRadius: "50%" }}
              src={require("../../assets/default.png").default}
            />
          </Badge>
          <span style={{ marginLeft: 12 }}>username</span>
        </List.Item>
      </List>
      <br></br>
      <h1>Like and Comment Notifications:</h1>
      <List style={{ marginTop: 10 }}>
        <List.Item extra="12:00" arrow="horizontal">
          <Badge dot>
            <img
              style={{ height: "100%", borderRadius: "50%" }}
              src={require("../../assets/default.png").default}
            />
          </Badge>
          <span style={{ marginLeft: 12 }}>username</span>
        </List.Item>
      </List>
    </div>
  );
};

export default Inbox;
*/

import React, { Component } from "react";
import { List, Badge, NavBar, Icon } from "antd-mobile";
import { Button, Form, Input, message, Modal } from "antd";
import store from "../../store/store";
import "./index.css";
import { client } from "../../http";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
          items: [],
          isLoaded: false,
        }
    }

    componentDidMount() {
      fetch('http://jsonplaceholder.typicode.com/users')
        .then(res => res.json())
        .then(json => {
          this.setState({
            isLoaded: true,
            items: json,
          })
        });

    }

    render() {

      var { isLoaded, items } = this.state;
      if (!isLoaded) {
        return <div>Loading</div>
      }
      else {
      return (
      
          <div className="App">
              <u1>
                {items.map(item => (
                    
                ))};
              </u1>
            </div>
        );
      }
  }
}


export default App;