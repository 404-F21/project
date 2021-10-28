import React, { Component } from 'react';
import { Link, useHistory } from 'react-router-dom';
//import Contacts from '/Users/nathandrapeza/Documents/year4/404/project/front_end/src/posts/posts'

import Contacts from './../../posts/posts'
import { Card } from 'antd';
import './index.css';
const { Meta } = Card;

/* 
Source: https://pusher.com/tutorials/consume-restful-api-react/
By Fiyaso Afolayan, March 29, 2019
Used tutorial for getting data from api
*/
class App extends Component {

    state = {
        contacts: []
    } 
    
    componentDidMount() {
        fetch('http://127.0.0.1:8000/')
        .then(res => res.json())
        .then((data) => {
            this.setState({ contacts: data })
        })
        .catch(console.log)
      }

    //const history = useHistory()
    render() {
        return (
            <div className='home w1200'>
                <div className='today'>
                </div>
                <form action="http://127.0.0.1:8000/" method="post">
                    <div>
                        <center><label>Post title</label><br></br></center>
                        <center><input name="title"></input></center>
                    </div>
                    <div>
                        <center><label>Post text</label><br></br></center>
                        <center><input name="post_text" size="100"></input></center>
                    </div>
                    <center><input type="submit"></input></center>
                </form>
                <center><h2 style={{ lineHeight: '50px' }}>Recent posts</h2></center>
                <Contacts contacts = {this.state.contacts}/>
            </div>
        );
    }
}


export default App
{/* <Card  onClick={()=>history.push('/individualpost')}>
<Card.Header
    title={
        <div style={{ marginLeft: 10, fontSize: 14 }}>username</div>
    }
    thumb={
        <img
            style={{ width: 35, borderRadius: 10 }}
            src={require('../assets/user.jpg').default}
        />
    }
    thumbStyle={{ width: 35, borderRadius: 10 }}
/>
<Card.Body>
    <div style={{ marginBottom: '3px' }}>messData.detail</div>
    <div className='like'>
        <div>
            <i className="iconfont icon-xiaoxi"></i>
            <div style={{ marginLeft: 5, display: 'inline-block', width: 35 }}>
                {99}
            </div>
            <i className="iconfont icon-dianzan"></i>
            <div style={{ marginLeft: 5, display: 'inline-block', width: 35 }}>
                {99}
            </div>
        </div>
    </div>
</Card.Body>
</Card>
<Card  onClick={()=>history.push('/individualpost')}>
<Card.Header
    title={
        <div style={{ marginLeft: 10, fontSize: 14 }}>username</div>
    }
    thumb={
        <img
            style={{ width: 35, borderRadius: 10 }}
            src={require('../assets/user.jpg').default}
        />
    }
    thumbStyle={{ width: 35, borderRadius: 10 }}
/>
<Card.Body>
    <div style={{ marginBottom: '3px' }}>messData.detail</div>
    <div className='like'>
        <div>
            <i className="iconfont icon-xiaoxi"></i>
            <div style={{ marginLeft: 5, display: 'inline-block', width: 35 }}>
                {99}
            </div>
            <i className="iconfont icon-dianzan"></i>
            <div style={{ marginLeft: 5, display: 'inline-block', width: 35 }}>
                {99}
            </div>
        </div>
    </div>
</Card.Body>
</Card> */}