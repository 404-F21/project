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

import React, { useEffect, useState } from 'react';
import { List, Tabs, NavBar, Icon } from 'antd-mobile';
import { Radio } from 'antd';
import { client } from '../../http';
import store from '../../store/store';

const Item = List.Item;
const Brief = Item.Brief;

const UserList = () => {
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

const Friends = _ => {
  const [userList, setUserList] = useState([]);
  const [authorId, setAuthorId] = useState('');

  const getUserList = async endpoint => {
    switch (endpoint) {
      case 'a':
        await client.get(`author/${authorId}/friends`);
        break;
      case 'b':
        await client.get(`author/${authorId}/followers`);
        break;
      case 'c':
        break;
      default:

    }
  }

  useEffect(() => {
    setAuthorId(store.getState().login.id);
  }, []);

  return (
      <>
      <Radio.Group
        style={{display: 'flex', justifyContent: 'center', margin: 10}}
        defaultValue='a'
        optionType='button'
        size='large'>
        <Radio.Button value='a'>Friends</Radio.Button>
        <Radio.Button value='b'>Followers</Radio.Button>
        <Radio.Button value='c'>Following</Radio.Button>
      </Radio.Group>

      <div className="user">
        <UserList />
        <UserList />
        <UserList />
      </div>
      </>
  );
};

export default Friends;
