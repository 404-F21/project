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
                <center><h2 style={{ lineHeight: '50px' }}>Recent posts</h2></center>
                <Contacts contacts = {this.state.contacts}/>
            </div>
        );
    }
}


export default App;