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
import { List, Tabs, NavBar, Icon } from "antd-mobile";
import { useHistory } from "react-router-dom";
const Item = List.Item;
const Brief = Item.Brief;

const UserList = () => {
  const history = useHistory();
  return (
    <List className="my-list">
      <Item
        arrow="horizontal"
        thumb={
          <img
            style={{ width: 45, height: 45, borderRadius: 10 }}
            src={require("../../assets/user.jpg").default}
          />
        }
        onClick={() => {}}
      >
        username
        <Brief>summary</Brief>
      </Item>
    </List>
  );
};
export default (props) => {
  return (
    <div className="user">
      <UserList />
      <UserList />
      <UserList />
    </div>
  );
};
