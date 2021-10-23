import React, { useState,useEffect } from 'react'
import './login.css';
import { useHistory,Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginAction } from '../../store/actions'
import { Input, Modal } from 'antd';
const Login = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const log = async () => {
        localStorage.setItem('userinfo', JSON.stringify({ username: 'lili', token: 'abcdef' }))
        dispatch(loginAction({ username: 'lili', token: 'abcdef' }))
        history.replace('/')
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
                                <Input type="text" placeholder="username" name="username" />
                            </div>
                            <div className='input'>
                                <Input type="password" onPressEnter={ ()=>{} } className="pwd" placeholder="password" name="pwd"  />
                            </div>
                            {/* <div className="forgetpwd" onClick={ ()=>{} }>forget password？</div> */}
                            <div className="loginbtn" onClick={ log }>Log In</div>
                            {/* <div className='changeLogin'>
                                <Link to='/register'>to Register</Link>
                            </div> */}
                        </div>
                    </div>
            </div>
        </div>

    );
}
export default Login