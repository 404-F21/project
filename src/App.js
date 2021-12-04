/* Copyright 2021 Nathan Drapeza, Xingjie He, Yifan Wu
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

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import User from './pages/user';
import store from './store/store';
import { Provider } from 'react-redux';
import 'antd-mobile/dist/antd-mobile.css';
import './App.css';
import Register from './pages/register';
import Inbox from './pages/inbox';
import Friends from './pages/friends';
import IndividualPost from './pages/individualPost';
import EditInfo from './pages/editInfo';
import Header from './components/Header';
import 'antd/dist/antd.css';
import './iconfont/iconfont.css'
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className='app'>
          <Header />
          <div className='appContent'>
            <Route exact path='/' component={Home} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/user/:id' component={User} />
            <Route path='/inbox' component={Inbox} />
            <Route path='/friends' component={Friends} />
            <Route path='/individualpost/:id' component={IndividualPost} />
            <Route path='/editinfo' component={EditInfo} />
          </div>
        </div>
      </Router>
    </Provider>
  )
}

export default App;

