import React, { useState,useEffect } from 'react'
import './login.css';
import { useHistory,Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginAction } from '../../store/actions'
import { Input, Modal } from 'antd';



const Register = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    /*
    const log = async () => {
        localStorage.setItem('userinfo', JSON.stringify({ username: 'lili', token: 'abcdef' }))
        dispatch(loginAction({ username: 'lili', token: 'abcdef' }))
        history.replace('/')
    }
    */
    const log = async () => {
        localStorage.setItem('userinfo', JSON.stringify({ username: "NathanD" }))
        //dispatch(loginAction({ username: 'lili', token: 'abcdef' }))
        history.replace('/')
    }
    return (
        <div className="bg">
            <div className="register">
                    <div className="logincon">
                        {/* <div style={{textAlign:'center',margin:'50px 0 30px'}}> 
                            <img src={require('../../assets/logo.png').default} alt="" />
                        </div> */}
                        <form action="http://127.0.0.1:8000/register/" method="post">
                            <div className='input'>
                                <Input type="text" placeholder="display name" name="displayName" />
                            </div>
                            <div className='input'>
                                <Input type="text" placeholder="github url" name="githubUrl" />
                            </div>
                            <div className='input'>
                                <Input type="password" onPressEnter={ ()=>{} } className="pwd" placeholder="password" name="pwd"  />
                            </div>
                            <div className='input'>
                                <Input type="password" onPressEnter={ ()=>{} } className="pwd" placeholder="confirm password" name="pwd"  />
                            </div>
                            {/* <div className="forgetpwd" onClick={ ()=>{} }>forget password？</div> */}
                            <center><input type="submit" onClick={ ()=> {}}></input></center>
                            {/* <div className='changeLogin'>
                                <Link to='/login'>to Login</Link>
                            </div> */}
                        </form>
                    </div>
            </div>
        </div>

    );
}
export default Register