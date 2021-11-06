import React, { Component, useCallback, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
//import Contacts from '/Users/nathandrapeza/Documents/year4/404/project/front_end/src/posts/posts'

import Contacts from './../../posts/posts'

import { List, Card, Icon, NavBar } from 'antd-mobile';
import { Form, Input, Avatar, Button, message } from 'antd';
import './index.css';
import { client } from '../../http';
import store from '../../store/store';
const { Meta } = Card;

const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
};


const App = (props) => {
    const history = useHistory()

    // create a post
    const sendPost = async (data) => {
        data['authorId'] = store.getState().login.id
        const result = await client.post('posts', data)
        console.log(result)
        if (result.status == 200) {
            message.success('post successfully!')
            await getPostList()
        }
    }

    const [postList, setPostList] = useState([])

    // get post list function
    const getPostList = useCallback(async () => {
        const result = await client.get('post')
        if (result.status === 200) {
            console.log(result.data)
            setPostList(result.data)
        }
    }, [])

    // Get list on initialization
    useEffect(async () => {
        await getPostList()
    }, [])

    return (
        <div className='home w1200'>
            <div className='today'>
            </div>
            <Form {...layout} name="nest-messages" onFinish={sendPost}>
                <Form.Item name={['title']} label="title">
                    <Input placeholder="please input your post's title"/>
                </Form.Item>
                <Form.Item name={['post_text']} label="post text">
                    <Input.TextArea placeholder="please input your post's text"/>
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        Post
                    </Button>
                </Form.Item>
            </Form>
            <div>   
                {postList.map(item => (
                    // <Card key={item.postId} onClick={()=> history.push(`/individualpost/${item.postId}`)}>
                    //     <Meta
                    //         avatar={<Avatar src={require('../../assets/user.jpg').default} />}
                    //         title={item.title}
                    //         description={item.post_text}
                    //         />
                    // </Card>
                    <Card onClick={() => history.push(`/individualpost/${item.postId}`)}>
                        <Card.Header
                            title={
                                <div style={{ marginLeft: 10, fontSize: 14 }}>
                                    {item.authorId.displayName}
                                </div>
                            }
                            thumb={
                                <img
                                    style={{ width: 35, borderRadius: 10 }}
                                    src={require('../../assets/user.jpg').default}
                                />
                            }
                            thumbStyle={{ width: 35, borderRadius: 10 }}
                        />
                        <Card.Body>
                            <h4>{item.title}</h4>
                            <div style={{ marginBottom: '3px' }}>{item.post_text}</div>
                            <div className='like'>
                                <div>
                                    <i className="iconfont icon-xiaoxi"></i>
                                    <div style={{ marginLeft: 5, display: 'inline-block', width: 35 }}>
                                        {item.commentCount}
                                    </div>
                                    <i className="iconfont icon-dianzan"></i>
                                    <div style={{ marginLeft: 5, display: 'inline-block', width: 35 }}>
                                        {item.likeCount}
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    )
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
