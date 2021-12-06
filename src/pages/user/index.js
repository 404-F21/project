/* Copyright 2021 Nathan Drapeza
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *      http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Card } from "antd-mobile";
import { useDispatch } from "react-redux";
import { Button, Form, Input, message, Modal } from "antd";
import "./index.css";
import { client } from "../../http";
import store from '../../store/store';
import { Remark } from "react-remark";
import remarkGemoji from "remark-gemoji";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const User = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [postList, setPostList] = useState([]);
  const [userinfo, setUserinfo] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editPostData, setEditPostData] = useState();
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const edit = () => {
    setIsModalVisible(true);
  };

  const userId = props.match?.params?.id;
  const loginUserInfo = JSON.parse(localStorage.getItem("userinfo"));

  const loadUser = async () => {
    const result = await client.get(`author/${userId}/`);
    if (result.status === 200) {
      setUserinfo(result.data);
    }
  };

  const onFinish = async (values) => {
    const result = await client.post(`author/${userId}/`, values);
    if (result.status === 200) {
      message.success("Edit successfully");
      loadUser();
    } else {
      message.error("Something wrong");
    }
    setIsModalVisible(false);
  };

  const onFinishEdit = async (values) => {
    const result = await client.post(
      `author/${userId}/posts/${editPostData.id}`,
      values
    );
    if (result.status === 200) {
      message.success("Edit successfully");
    } else {
      message.error("Get data wrong");
    }
    setEditModal(false);
    loadData();
  };

	const followUser = async () => {
		const result = await client.put(`author/${userId}/followers/a464d46a-6bc2-458b-abd0-71228e88565f`)
		message.success('user page:' + {userId} + ", follower: ")
	}

	const onFinish = async (values) => {
		console.log(values);
		const result = await client.post(`author/${userId}/`, values)
		if (result.status === 200) {
			message.success('Edit successfully')
			loadUser()
		} else {
			message.error('Something wrong')
		}
		setIsModalVisible(false);
	};

  const loadData = async () => {
    const result = await client.get(`author/${userId}/posts/`);
    if (result.status === 200) {
      result.data.items.map((item) => {
        if (
          item.contentType === "image/png" ||
          item.contentType === "image/jpeg" ||
          item.contentType === "image/jpg"
        ) {
          const base64 = "data:image/png;base64," + item.content.split("'")[1];
          item.imgSrc = base64;
        }
        if (
          item.contentType === "image/png;base64" ||
          item.contentType === "image/jpeg;base64"
        ) {
          item.imgSrc = item.content;
        }
        return item;
      });
      setPostList(result.data.items);
    } else {
      message.error("Something wrong");
    }
  };

    const checkFollowing = async () => {
        const current_user = store.getState().login.id;
        const result = await client.get(`author/${userId}/followers/` + current_user)
        if (result.data.isFollower === true) {
            document.querySelector('#followButton').textContent = 'Unfollow';
            return true;
        }
        else {
            return false;
        }

    }

    const followUser = async () => {
        const current_user = store.getState().login.id;
        const result = await client.get(`author/${userId}/followers/` + current_user)
        if (result.data.isFollower === true) {
            await client.delete(`author/${userId}/followers/` + current_user)
            message.success('Unfollowed user!')
            document.querySelector('#followButton').textContent = 'Follow';
        }
        else {
            const result = await client.put(`author/${userId}/followers/` + current_user)
            message.success('Now following user!')
            document.querySelector('#followButton').textContent = 'Unfollow';
        }
    }
    

    const onFinish = async (values) => {
        console.log(values);
        const result = await client.post(`author/${userId}/`, values)
        if (result.status === 200) {
            message.success('Edit successfully')
            loadUser()
        } else {
            message.error('Something wrong')

  useEffect(async () => {
    await loadData();
    await loadUser();
    await checkFollowing();
  }, []);

  // need this or ordered lists render all screwy
  const customLi = (props) => <li style={{ marginLeft: "2em" }} {...props} />;

    return (
        <div className="user">
            <div className="userinfo bgw">
                <img
                    className="userimg"
                    src={require('../../assets/user.jpg').default}
                    alt=""
                />
                <div>
                    <h2>{userinfo?.displayName}</h2>
                    <p>{userinfo?.github}</p>
                </div>
                {
                    loginUserInfo && userId !== loginUserInfo.id ?
                    <div>
                    
                    <Button type={'primary'} id='followButton' style={{width: '150px', marginLeft: '20px'}} onClick={followUser}>Follow</Button>
                    </div>
                        :
                        null
                }

                {
                    loginUserInfo && userId === loginUserInfo.id ?
                        <a className='edit' onClick={edit}>
                            <i className='iconfont icon-bianji'><span style={{paddingLeft: 10}}>Edit</span></i>
                        </a>
                        :
                        null
                }
            </div>
            <h3 style={{marginTop: '30px'}}>My Posts</h3>
            <div className='posts'>
                {
                    postList.map(item => {
                            return (
                                <Card style={{marginTop: '10px', marginBottom: '10px'}}>
                                    <Card.Header
                                        title={item.title}
                                        thumb={
                                            <img
                                                style={{width: 35, borderRadius: 10}}
                                                src={require('../../assets/user.jpg').default}
                                            />
                                        }
                                        thumbStyle={{width: 35, borderRadius: 10}}
                                    />
                                    <Card.Body>
                                        <div style={{marginBottom: '3px'}}
                                             onClick={() => {
                                                 localStorage.setItem(item.id, JSON.stringify(item))
                                                 history.push('/individualpost/' + item.id)
                                             }}>
                                            {
                                                (item.contentType === 'image/png' ||
                                                    item.contentType === 'image/jpeg' ||
                                                    item.contentType === 'image/jpg' ||
                                                    item.contentType === 'image/png;base64' ||
					                                item.contentType === 'image/jpeg;base64') ?
                                                    <img src={item.imgSrc} width={'100%'}/>
                                                    : item.contentType === 'text/markdown' ?
                                                        (<Remark
                                                            remarkPlugins={[remarkGemoji]}
                                                            rehypeReactOptions={{
                                                                components: {li: customLi}
                                                            }}>
                                                            {item.content}
                                                        </Remark>)
                                                        :
                                                        item.content
                                            }
                                        </div>
                                        <div className='like'>
                                            <div>
                                                <i className="iconfont icon-xiaoxi"></i>
                                                <div style={{marginLeft: 5, display: 'inline-block', width: 35}}>
                                                    {item.commentCount}
                                                </div>
                                                <i className="iconfont icon-dianzan"></i>
                                                <div style={{marginLeft: 5, display: 'inline-block', width: 35}}>
                                                    {item.likeCount}
                                                </div>
                                                {
                                                    loginUserInfo && userId === loginUserInfo.id ?
                                                    <>
                                                        <i className="iconfont icon-bianji" onClick={() => {
                                                            setEditPostData(item)
                                                            setEditModal(true)
                                                        }}/>
                                                        <i className="iconfont icon-shanchu" onClick={async () => {
                                                            const result = await client.delete(`author/${userId}/posts/${item.id}`)
                                                            if (result.status === 200) {
                                                                message.success('Delete successfully')
                                                            } else {
                                                                message.error('Something wrong')
                                                            }
                                                            loadData()
                                                        }} style={{marginLeft: 15}}/>
                                                    </>
                                                        :
                                                        null
                                                }
                                                <div style={{marginLeft: 10, display: 'inline-block'}}>
                                                    Published: {new Date(item.published).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            )
                        }
                    )
                }
            </div>
            <Modal footer={null} title="Edit Userinfo" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form {...layout} name="nest-messages" onFinish={onFinish}>
                    <Form.Item name={'displayName'} label="Name" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'github'} label="Github" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal footer={null} title="Edit Post" visible={editModal} onCancel={() => setEditModal(false)}>
                <Form {...layout} name="nest-messages" onFinish={onFinishEdit}>
                    <Form.Item name={'title'} label="Title" rules={[{required: true}]}>
                        <Input type={'text'}/>
                    </Form.Item>
                    <Form.Item name={'content'} label="Content" rules={[{required: true}]}>
                        <textarea/>
                    </Form.Item>
                    <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
        {loginUserInfo && userId === loginUserInfo.id ? (
          <a className="edit" onClick={edit}>
            <i className="iconfont icon-bianji">
              <span style={{ paddingLeft: 10 }}>Edit</span>
            </i>
          </a>
        ) : null}
      <h3 style={{ marginTop: "30px" }}>My Posts</h3>
      <div className="posts">
        {postList.map((item) => {
          return (
            <Card style={{ marginTop: "10px", marginBottom: "10px" }}>
              <Card.Header
                title={item.title}
                thumb={
                  <img
                    style={{ width: 35, borderRadius: 10 }}
                    src={require("../../assets/default.png").default}
                  />
                }
                thumbStyle={{ width: 35, borderRadius: 10 }}
              />
              <Card.Body>
                <div
                  style={{ marginBottom: "3px" }}
                  onClick={() => {
                    localStorage.setItem(item.id, JSON.stringify(item));
                    history.push("/individualpost/" + item.id);
                  }}
                >
                  {item.contentType === "image/png" ||
                  item.contentType === "image/jpeg" ||
                  item.contentType === "image/jpg" ||
                  item.contentType === "image/png;base64" ||
                  item.contentType === "image/jpeg;base64" ? (
                    <img src={item.imgSrc} width={"100%"} />
                  ) : item.contentType === "text/markdown" ? (
                    <Remark
                      remarkPlugins={[remarkGemoji]}
                      rehypeReactOptions={{
                        components: { li: customLi },
                      }}
                    >
                      {item.content}
                    </Remark>
                  ) : (
                    item.content
                  )}
                </div>
                <div className="like">
                  <div>
                    <i className="iconfont icon-xiaoxi"></i>
                    <div
                      style={{
                        marginLeft: 5,
                        display: "inline-block",
                        width: 35,
                      }}
                    >
                      {item.commentCount}
                    </div>
                    <i className="iconfont icon-dianzan"></i>
                    <div
                      style={{
                        marginLeft: 5,
                        display: "inline-block",
                        width: 35,
                      }}
                    >
                      {item.likeCount}
                    </div>
                    {loginUserInfo && userId === loginUserInfo.id ? (
                      <>
                        <i
                          className="iconfont icon-bianji"
                          onClick={() => {
                            setEditPostData(item);
                            setEditModal(true);
                          }}
                        />
                        <i
                          className="iconfont icon-shanchu"
                          onClick={async () => {
                            const result = await client.delete(
                              `author/${userId}/posts/${item.id}`
                            );
                            if (result.status === 200) {
                              message.success("Delete successfully");
                            } else {
                              message.error("Something wrong");
                            }
                            loadData();
                          }}
                          style={{ marginLeft: 15 }}
                        />
                      </>
                    ) : null}
                    <div style={{ marginLeft: 10, display: "inline-block" }}>
                      Published: {new Date(item.published).toLocaleString()}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>
      <Modal
        footer={null}
        title="Edit Userinfo"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form {...layout} name="nest-messages" onFinish={onFinish}>
          <Form.Item
            name={"displayName"}
            label="Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"github"}
            label="Github"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        footer={null}
        title="Edit Post"
        visible={editModal}
        onCancel={() => setEditModal(false)}
      >
        <Form {...layout} name="nest-messages" onFinish={onFinishEdit}>
          <Form.Item name={"title"} label="Title" rules={[{ required: true }]}>
            <Input type={"text"} />
          </Form.Item>
          <Form.Item
            name={"content"}
            label="Content"
            rules={[{ required: true }]}
          >
            <textarea />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default User;
