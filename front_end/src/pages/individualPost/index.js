import React from 'react'
import { List, Card, NavBar, Icon } from 'antd-mobile';
import DialogueFooter from './DialogueFooter';
import './index.css'
const IndividualPost = (props) => {
    return (
        <div className='indi w1200'>
            <div className='posts-box'>
                <div className="posts bgw">
                    <div className="comments p15 bgw mt10">
                        <div className='comments-item'>
                            <div className="user-title">
                                <img
                                    style={{ width: 30, height: 30, borderRadius: '50%' }}
                                    src={require('../../assets/user.jpg').default}
                                />
                                <div className='username'>aaaaa</div>
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
                            <div className="reply pl15">
                        <div className='reply-item'>
                            <div className="user-title">
                                <img
                                    style={{ width: 30, height: 30, borderRadius: '50%' }}
                                    src={require('../../assets/user.jpg').default}
                                />
                                <div className='username'>bbbbb</div>
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
                            <div className="reply pl15">
                                <div className="user-title">
                                    <img
                                        style={{ width: 30, height: 30, borderRadius: '50%' }}
                                        src={require('../../assets/user.jpg').default}
                                    />
                                    <div className='username'>ccccc</div>
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
                        <div className='reply-item'>
                            <div className="user-title">
                                <img
                                    style={{ width: 30, height: 30, borderRadius: '50%' }}
                                    src={require('../../assets/user.jpg').default}
                                />
                                <div className='username'>ddddd</div>
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
                            <div className="reply pl15">
                                <div className="user-title">
                                    <img
                                        style={{ width: 30, height: 30, borderRadius: '50%' }}
                                        src={require('../../assets/user.jpg').default}
                                    />
                                    <div className='username'>eeeee</div>
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
                        </div>
                    </div>
                </div>
                <div className="top-news bgw">userinfo </div>
            </div>
        </div>
    )
}

export default IndividualPost
