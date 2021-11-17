import React, { useState,useEffect } from 'react'
import './login.css';
import { useHistory,Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginAction } from '../../store/actions'
import { Input, message } from 'antd';
import { client } from '../../http';
const Register = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [displayName, setDisplayName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const reg = async () => {
        if (
            judge(displayName, 'Please input display name') &&
            judge(password, 'Please input password') &&
            judge(password === confirmPassword, 'The password is not equal to the confirmation password')
        ) {
            let user = { displayName, password };
            const ret = await client.post('register', user)
            if (ret.status >= 200 && ret.status < 400) {
                message.success('register successfully!')
                history.replace('/login')
            }
            console.log(ret)
        }
        // localStorage.setItem('userinfo', JSON.stringify({ username: 'lili', token: 'abcdef' }))
        // dispatch(loginAction({ username: 'lili', token: 'abcdef' }))
        // history.replace('/')
    }

    const judge = (cond, msg) => {
        !cond && message.warn(msg)
        return cond
    }
    return (
        <div className="bg">
            <div className="login">
                    <div className="logincon">
                        <div style={{textAlign:'center',margin:'50px 0 30px'}}> 
                            <img src={require('../../assets/logo.png').default} alt="" />
                        </div>
                        <div className="loginform">
                            <div className='input'>
                                <Input type="text" placeholder="display name" name="displayName" value={displayName} onChange={e => setDisplayName(e.target.value)}/>
                            </div>
                            <div className='input'>
                                <Input type="password" className="pwd" placeholder="password" name="pwd" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div className='input'>
                                <Input type="password" className="pwd" placeholder="confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                            </div>
                            <div className="loginbtn" onClick={ reg }>Sign Up</div>
                        </div>
                    </div>
            </div>
        </div>

    );
}
export default Register