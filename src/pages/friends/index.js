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

import React, { useEffect, useState } from "react";
import { List, Tabs, NavBar, Icon } from "antd-mobile";
import { Radio } from "antd";
import { client } from "../../http";
import store from "../../store/store";
import { useHistory } from "react-router-dom";

const Item = List.Item;
const Brief = Item.Brief;

const UserList = (props) => {
  const history = useHistory();

  return (
    <List className="my-list">
      {props.users.map((user) => (
        <Item
          arrow="horizontal"
          thumb={
            <img
              style={{ width: 45, height: 45, borderRadius: 10 }}
              src={require("../../assets/default.png").default}
            />
          }
          onClick={() => {
            history.push("/user/" + user.id);
          }}
        >
          {user.displayName}
          <Brief>{user.host}</Brief>
        </Item>
      ))}
    </List>
  );
};

const pullUsers = async (endpoint) => {
  const result = await client.get(endpoint);
  if (result.status === 200) {
    console.log(result.data.type);
    return result.data.items;
  } else {
    return [];
  }
};

const Friends = (_) => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  const authorId = store.getState().login.id;

  const getUserList = async (endpoint) => {
    setLoading(true);
    switch (endpoint) {
      case "a":
        setUserList(await pullUsers(`author/${authorId}/friends`));
        break;
      case "b":
        setUserList(await pullUsers(`author/${authorId}/followers`));
        break;
      case "c":
        setUserList(await pullUsers(`author/${authorId}/followed`));
        break;
      default:
    }
    setLoading(false);
  };

  const radioChange = (e) => {
    getUserList(e.target.value);
  };

  useEffect(() => {
    getUserList("a");
  }, []);

  return (
    <>
      <Radio.Group
        style={{ display: "flex", justifyContent: "center", margin: 10 }}
        defaultValue="a"
        optionType="button"
        size="large"
        onChange={radioChange}
        disabled={loading}
      >
        <Radio.Button value="a">Friends</Radio.Button>
        <Radio.Button value="b">Followers</Radio.Button>
        <Radio.Button value="c">Following</Radio.Button>
      </Radio.Group>

      <div className="user">
        <UserList users={userList} />
      </div>
    </>
  );
};

export default Friends;
