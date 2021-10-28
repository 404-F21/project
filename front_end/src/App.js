import React from 'react';
import { BrowserRouter as Router,Route,Redirect } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import User from './pages/user';
import store from './store/store';
import {Provider} from 'react-redux';
import 'antd-mobile/dist/antd-mobile.css';
import './App.css';
import Register from './pages/register';
import Inbox from './pages/inbox';
import Friends from './pages/friends';
import IndividualPost from './pages/individualPost';
import EditInfo from './pages/editInfo';
import Header from './components/Header';
import 'antd/dist/antd.css';
import Post from './pages/post';

const PrivateRoute = ({component:Com,...rest})=>{
  return <Route {...rest} render={()=>{
      const userinfo = JSON.parse(localStorage.getItem('userinfo'));
      if(userinfo&&userinfo.token){
          return  <Com />
      }else{
          return <Redirect to={{
              pathname: '/login',
          }}/>
      }
  }}/>
}
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className='app'>
          <Header />
          <div className='appContent'>
            <PrivateRoute exact path='/' component={Home} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/user' component={User} />
            <Route path='/inbox' component={Inbox} />
            <Route path='/friends' component={Friends} />
            <Route path='/post' component={Post} />
            <Route path='/individualpost' component={IndividualPost} />
            <Route path='/editinfo' component={EditInfo} />
          </div>
        </div>
      </Router>
    </Provider>
  )
}

export default App;

