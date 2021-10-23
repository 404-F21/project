import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Card } from 'antd';
import './index.css';
const { Meta } = Card;
const Home = (props) => {

    const history = useHistory()

    return (
        <div className='home w1200'>
            <div className='today'>
                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src={require('../../assets/user.jpg').default} />}
                >
                    <Meta title="Europe Street beat" description="www.instagram.com" />
                </Card>
                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src={require('../../assets/user.jpg').default} />}
                >
                    <Meta title="Europe Street beat" description="www.instagram.com" />
                </Card>
                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src={require('../../assets/user.jpg').default} />}
                >
                    <Meta title="Europe Street beat" description="www.instagram.com" />
                </Card>
                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src={require('../../assets/user.jpg').default} />}
                >
                    <Meta title="Europe Street beat" description="www.instagram.com" />
                </Card>
            </div>
            <h2 style={{ lineHeight: '50px' }}>Popular posts</h2>
            <div className='posts-box'>
                <div className="posts bgw">
                    <div className="comments p15 bgw mt10">
                        <div className='comments-item'>
                            <div className="user-title">
                                <img
                                    style={{ width: 30, height: 30, borderRadius: '50%' }}
                                    src={require('../../assets/user.jpg').default}
                                />
                                <div className='username'>
                                    <div>aaaaa</div>
                                </div>
                            </div>
                            <p>
                                comment detail xxx  yyyy
                            </p>
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
                        </div>
                    </div>
                </div>
                <div className="top-news bgw">Top News </div>
            </div>
        </div>
    )
}


export default Home
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