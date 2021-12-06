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

import React from "react";
import { List, Badge, NavBar, Icon } from "antd-mobile";
import "./index.css";
const Inbox = (props) => {
  return (
    <div className="inbox w1200">
      <List style={{ marginTop: 10 }}>
        <List.Item extra="12:00" arrow="horizontal">
          <Badge dot>
            <img
              style={{ height: "100%", borderRadius: "50%" }}
              src={require("../../assets/user.jpg").default}
            />
          </Badge>
          <span style={{ marginLeft: 12 }}>username</span>
        </List.Item>
        <List.Item extra="12:00" arrow="horizontal">
          <Badge dot>
            <img
              style={{ height: "100%", borderRadius: "50%" }}
              src={require("../../assets/user.jpg").default}
            />
          </Badge>
          <span style={{ marginLeft: 12 }}>username</span>
        </List.Item>
        <List.Item extra="12:00" arrow="horizontal">
          <Badge dot>
            <img
              style={{ height: "100%", borderRadius: "50%" }}
              src={require("../../assets/user.jpg").default}
            />
          </Badge>
          <span style={{ marginLeft: 12 }}>username</span>
        </List.Item>
        <List.Item extra="12:00" arrow="horizontal">
          <Badge dot>
            <img
              style={{ height: "100%", borderRadius: "50%" }}
              src={require("../../assets/user.jpg").default}
            />
          </Badge>
          <span style={{ marginLeft: 12 }}>username</span>
        </List.Item>
      </List>
    </div>
  );
};

export default Inbox;
