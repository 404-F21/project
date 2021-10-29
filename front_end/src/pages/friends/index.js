import React from 'react';
import { List, Tabs, NavBar, Icon } from 'antd-mobile';
import { useHistory } from 'react-router-dom';
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
                        src={require('../../assets/user.jpg').default}
                    />
                }
                onClick={() => {
                    // history.push('/xiaoxi/DialogueDetail');
                }}
                // extra={<span>12:20</span>}
            >
                username
                <Brief>summary</Brief>
            </Item>
        </List>
    );
};
export default props => {
    console.log(props);
    return (
        <div className="user">
            <UserList />
            <UserList />
            <UserList />
        </div>
    );
};
