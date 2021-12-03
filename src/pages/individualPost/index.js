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

import React, {useCallback, useEffect, useState} from 'react'

import {Button, Input, message} from 'antd';
import './index.css'
import {client} from '../../http';
import store from '../../store/store';
import {Remark} from "react-remark";
import remarkGemoji from "remark-gemoji";

const layout = {
    labelCol: {span: 2},
    wrapperCol: {span: 22},
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
        const result = await client.post(`post/${postData.id}/comments/`, {
            authorId: postData.author.id,
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
            // let result = await client.get(`post/${id}`)
            // setPostData(result.data)
            const jsonString = localStorage.getItem(id)
            const item = JSON.parse(jsonString)
            console.log(item)
            setPostData(item)
        }
    }, [])

    const [commentList, setCommentList] = useState([])

    // update comment list function
    const updateCommentList = useCallback(async () => {
        if (postData) {
            let res = {status: 0};
            if (postData.foreignNodeId) {
                let urlBase64
                // linkedspace comments
                if (postData.foreignNodeHost.indexOf('linkedspace-staging.herokuapp.com') !== -1) {
                    const url = postData.comments.replace('linkedspace-staging.herokuapp.com/author', 'linkedspace-staging.herokuapp.com/api/author')
                    urlBase64 = window.btoa(url)
                }
                if (postData.foreignNodeHost.indexOf('social-dis.herokuapp.com') !== -1) {
                    urlBase64 = window.btoa(postData.comments)
                }
                res = await client.get(`foreign-data/${postData.foreignNodeId}/${urlBase64}`)
                if (res.status === 200) {
                    // social-dis group comments
                    setCommentList(res.data.comments)
                }
            } else {
                res = await client.get(`post/${postData.id}/comments/`)
                if (res.status === 200) {
                    setCommentList(res.data)
                }
            }
        }
    }, [postData])

    // fetch comments 
    useEffect(async () => {
        await updateCommentList()
    }, [postData])

    // need this or ordered lists render all screwy
    const customLi = props => (
        <li style={{marginLeft: '2em'}} {...props} />
    );

    const likePost = async () => {
        if (!postData) {
            message.success('please waitting!')
            return
        }
        const result = await client.post(`post/${postData.id}/like/`, {
            authorId: store.getState().login.id
        })
        if (result.status == 200) {
            let {succ, count} = result.data
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
                                    style={{width: 30, height: 30, borderRadius: '50%'}}
                                    src={require('../../assets/user.jpg').default}
                                />
                                <div className='username'>{postData?.authorId?.displayName}</div>
                            </div>
                            <h3>{postData?.title}</h3>
                            <p>
                                {
                                    (postData?.contentType === 'image/png' ||
                                        postData?.contentType === 'image/jpeg' ||
                                        postData?.contentType === 'image/jpg') ||
                                        postData?.contentType === 'image' ||
                                        postData?.contentType === 'image/png;base64' ||
									    postData?.contentType === 'image/jpeg;base64' ?
                                        <img src={postData?.imgSrc} width={'100%'}/>
                                        : postData?.contentType === 'text/markdown' ?
                                            (<Remark
                                                remarkPlugins={[remarkGemoji]}
                                                rehypeReactOptions={{
                                                    components: {li: customLi}
                                                }}>
                                                {postData?.content}
                                            </Remark>)
                                            :
                                            postData?.content
                                }
                            </p>
                            <div className='like'>
                                <div>
                                    <i className="iconfont icon-xiaoxi"></i>
                                    <div style={{marginLeft: 5, display: 'inline-block', width: 35}}>
                                        {postData?.commentCount ?? 0}
                                    </div>
                                    <span className="like-btn" onClick={likePost}>
                                        <i className="iconfont icon-dianzan"></i>
                                        <div style={{marginLeft: 5, display: 'inline-block', width: 35}}>
                                            {postData?.likeCount ?? 0}
                                        </div>
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="top-news bgw">
                    <h3>Author Info</h3>
                    <div><b>Author Name: </b><span>{postData?.author?.displayName}</span></div>
                    <div><b>URL: </b><span><a href={postData?.author?.url}>Click to visit</a></span></div>
                    <div><b>Github: </b><span>{postData?.author?.github}</span></div>
                    <div><b>Host Comes From: </b><span>{postData?.author?.host}</span></div>
                </div>
            </div>

            <div className="comment-list">
                {commentList.map(item => (
                    <div className="comment-item" key={item.commentId}>
                        {
                            postData.foreignNodeId ?
                                postData.foreignNodeHost.indexOf('linkedspace-staging.herokuapp.com') !== -1 ?
                                    <>
                                        {/* Foreign format(linkedspace) */}
                                        <div>{item.content}</div>
                                        <div>{item.author.displayName} @ {item.author.host} @ {new Date(item.published).toLocaleString()}</div>
                                    </>
                                    :
                                    postData.foreignNodeHost.indexOf('social-dis.herokuapp.com') !== -1 ?
                                        <>
                                            {/* Foreign format(social-dis) */}
                                            <div>{item.comment}</div>
                                            <div>{item.author.displayName} @ {item.author.host} @ {new Date(item.published).toLocaleString()}</div>
                                        </>
                                        :
                                        null
                                :
                                <>
                                    {/* Internal format */}
                                    <div>{item.text}</div>
                                    <div>{item.authorId.displayName} @ {new Date(item.publishedOn).toLocaleString()}</div>
                                </>
                        }
                    </div>
                ))}
                {commentList.length === 0 ? (
                    <div style={{color: '#999'}}>Oop! It seems that no one has commented</div>
                ) : null}
            </div>

            <div className="comment-input">
                <Input placeholder="please input friendly comment" value={commentInput}
                       onChange={e => setCommentInput(e.target.value)}/>
                <Button type="primary" onClick={comment}>Send</Button>
            </div>
        </div>
    )
}

export default IndividualPost
