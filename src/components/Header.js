/* Copyright 2021 Nathan Drapeza
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *		http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect } from 'react'
import { useSelector, useDispatch, connect } from 'react-redux';
import { Link,useHistory } from 'react-router-dom'
import { Input, Menu, Dropdown, } from 'antd';
import { loginAction } from '../store/actions'
import {CaretDownOutlined} from '@ant-design/icons';
const { Search } = Input;
const Header = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const onSearch = () => { }
    const menu = (
        <Menu>
            <Menu.Item>
                <a >Setting</a>
            </Menu.Item>
            <Menu.Item>
                <a  onClick={() => {
                        localStorage.removeItem('userinfo')
                        dispatch(loginAction(null))
                        history.replace('/')
                    }}>Log Out</a>
            </Menu.Item>
        </Menu>
    );

    const userinfo = useSelector(state => state.login)
    console.log(userinfo)
    return (
        <header className='pheader bgw p15'>
            <Link to='/'>
                <img src={require('../assets/logo.png').default} alt="" />
            </Link>
            <Search placeholder="input search text" onSearch={onSearch} style={{ width: 400 }} />
            {userinfo ? <div>
                <Link to={'/user/' + userinfo.id}>UserPage</Link>
                <Link to='/inbox'>Inbox</Link>
                <Link to='/friends'>Friends</Link>
                <Dropdown overlay={menu} placement="bottomCenter" arrow>
                    <span>
                        <img style={{ width: 30, height: 30, borderRadius: 15, marginLeft: 20 }} src={userinfo.profilePic ? userinfo.profilePic : require('../assets/default.png').default} alt='' />
                        <CaretDownOutlined style={{ color: '#fff', fontSize: 20 }} />
                    </span>
                </Dropdown>
            </div> :
                <div>
                    <Link to='/login'>Log In</Link>
                    <Link to='/register'>Sign Up</Link>
                </div>}
        </header>
    )
}

export default Header
