/* Copyright 2021 Nathan Drapeza, Xingjie He, Warren Stix, Yifan Wu
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

import React, { useState } from 'react'
import './login.css';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginAction } from '../../store/actions'
import { Input, message } from 'antd';
import { client } from '../../http';

const Login = _ => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [displayName, setDisplayName] = useState('')
    const [password, setPassword] = useState('')

    const log = async event => {
		event.preventDefault()

        let user = { displayName, password }
        let ret = await client.post('log', user)
        console.log(ret)
        if (ret.data.succ === true) {
            let data = {
                ...user,
                id: ret.data.id,
            };
            dispatch(loginAction(data))
            localStorage.setItem('userinfo', JSON.stringify(data))
            message.success('login success!')
            history.replace('/')
        } else {
            message.error('login failed!')
        }
    }

    return (
        <div className="bg">
            <div className="login">
				<div className="logincon">
					<div style={{textAlign:'center',margin:'50px 0 30px'}}> 
						<img src={require('../../assets/logo.png').default} alt="" />
					</div>
					<form className="loginform" onSubmit={log}>
						<Input
							className='input'
							type="text"
							placeholder="display name"
							name="displayName"
							value={displayName}
							onChange={e => setDisplayName(e.target.value)}
						/>

						<Input
							type="password"
							className="input pwd"
							placeholder="password"
							name="pwd" 
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						{/* <div className="forgetpwd" onClick={ ()=>{} }>forget password？</div> */}
						<button
							className="loginbtn" type='submit'>Log In</button>
						{/* <div className='changeLogin'>
							<Link to='/register'>to Register</Link>
						</div> */}
					</form>
				</div>
            </div>
        </div>

    );
}
export default Login
