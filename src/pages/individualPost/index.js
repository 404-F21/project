import React, { useCallback, useEffect, useState } from 'react'
import { List, NavBar, Icon } from 'antd-mobile';

import { Card, Form, Input, Button, message, Typography } from 'antd';
import DialogueFooter from './DialogueFooter';
import './index.css'
import { client } from '../../http';
import { useHistory } from 'react-router';
import store from '../../store/store';

const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
};

const IndividualPost = (props) => {
    const [commentInput, setCommentInput] = useState('')

    // send comment
    const comment = async (data) => {
        if (!postData) {
            message.warn('please waitting')
            return
        }
        if (!commentInput) {
            message.warn('please input your comment')
            return
        }
        const result = await client.post(`posts/${postData.postId}/comments/`, {
            authorId: postData.authorId.id,
            postId: postData.postId,
            text: commentInput,
        })
        if (result.status == 200) {
            message.success('comment posted successfully!')
            setCommentInput('')
            updateCommentList()
        }
    }
    // post data state
    const [postData, setPostData] = useState(null)

    // fetch post data from server
    useEffect(async () => {
        let id = props.match?.params?.id
        if (id) {
            let result = await client.get(`post/${id}`)
            setPostData(result.data)
        }
    }, [])

    const [commentList, setCommentList] = useState([])

    // update comment list function
    const updateCommentList = useCallback(async () => {
        if (postData) {
            const res = await client.get(`post/${postData.postId}/comments/`)
            if (res.status == 200) {
                setCommentList(res.data)
            }
        }
    }, [postData])

    // fetch comments 
    useEffect(async () => {
        await updateCommentList()
    }, [postData])

    const likePost = async () => {
        if (!postData) {
            message.success('please waitting!')
            return
        }
        const result = await client.post(`post/${postData.postId}/like/`, {
            authorId: store.getState().login.id
        })
        if (result.status==200) {
            let { succ, count } = result.data
            if (succ) {
                message.success('liked!')
                console.log(count)
                setPostData((data) => {
                    data.likeCount = count
                    return {...data}
                })
            } else {
                message.warn('already liked!')
            }

        }
    }

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
                                <div className='username'>{postData?.authorId?.displayName}</div>
                            </div>
                            <h3>{postData?.title}</h3>
                            <p>{postData?.content}</p>
                            <div className='like'>
                                <div>
                                    <i className="iconfont icon-xiaoxi"></i>
                                    <div style={{ marginLeft: 5, display: 'inline-block', width: 35 }}>
                                        {postData?.commentCount ?? 0}
                                    </div>
                                    <span className="like-btn" onClick={likePost}>
                                        <i className="iconfont icon-dianzan"></i>
                                        <div style={{ marginLeft: 5, display: 'inline-block', width: 35 }}>
                                            {postData?.likeCount ?? 0}
                                        </div>
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="top-news bgw">
                    <div>user info</div>
                    <div>display name: <span>{postData?.authorId?.displayName}</span></div>
                </div>
            </div>

            <div className="comment-list">
                {commentList.map(item => (
                    <div className="comment-item" key={item.commentId}>
                        <div>{item.text}</div>
                        <div>{new Date(item.publishedOn).toLocaleString()}</div>
                    </div>
                ))}
                {commentList.length===0?(
                    <div style={{color:'#999'}}>Oop! It seems that no one has commented</div>
                ): null}
            </div>

            <div className="comment-input">
                <Input placeholder="please input friendly comment" value={commentInput} onChange={e => setCommentInput(e.target.value)} />
                <Button type="primary" onClick={comment}>Send</Button>
            </div>
        </div>
    )
}

export default IndividualPost
