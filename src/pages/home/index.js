/* Copyright 2021 Nathan Drapeza, Xingjie He, Warren Stix, Yifan Wu
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

import React, {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import ReactDOM from "react-dom";
//import Contacts from '/Users/nathandrapeza/Documents/year4/404/project/front_end/src/posts/posts'

import { Card } from 'antd-mobile';
import { Button, Form, Input, message, Switch, Radio, Upload } from 'antd';
import './index.css';
import { UploadOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import { client } from '../../http';
import store from '../../store/store';
import { Remark, useRemark } from 'react-remark';
import remarkGemoji from 'remark-gemoji';

const layout = {
    labelCol: {span: 2},
    wrapperCol: {span: 22},
};


const App = _ => {
    const history = useHistory();

    // var isMd = false, isBase = false, isPng = false, isJpeg = false; 

    const [isMd, setIsMd] = useState(false);
    const [isBase, setIsBase] = useState(false);
    const [isPng, setIsPng] = useState(false);
	const [isJpeg, setIsJpeg] = useState(false);

	const [postForm] = Form.useForm();

	// need this to get everything reset
	const [switchChecked, setSwitchChecked] = useState(false);
	const [hasContent, setHasContent] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

    // create a post
    const sendPost = async data => {
		setIsLoading(true);

        data['authorId'] = store.getState().login.id;
        if (isMd) { data['contentType'] = 'text/markdown'; }
        if (isBase) { data['contentType'] = 'application/base64'; }
        if (isPng) { data['contentType'] = 'image/png;base64'; }
		if (isJpeg) { data['contentType'] = 'image/jpeg;base64'; }

        const result = await client.post('posts', data);

		postForm.resetFields();
		setSwitchChecked(false);
        setIsMd(false);
        setIsBase(false);
        setIsPng(false);
		setIsJpeg(false);
		setHasContent(false);
		setIsLoading(false);

        if (result.status == 200) {
            message.success('Post successfully posted!');
            await getPostList();
        }
    }

    const [postList, setPostList] = useState([]);

	// need this or ordered lists render all screwy
	const customLi = props => (
		<li style={{marginLeft: '2em'}} {...props} />
	);

	const [previewText, setPreviewText] = useRemark({
		remarkPlugins: [ remarkGemoji ],
		rehypeReactOptions: {
			components: { li: customLi }
		}
	});
	const checkContent = (changedFields, _) => {
		for (let field of changedFields) {
			if (field.name[0] === 'content') {
				if (field.value.length > 0) {
					setHasContent(true);
					setPreviewText(field.value);
				} else {
					setHasContent(false);
				}
			}
		}
	};

    // get post list function
    const getPostList = useCallback(async () => {
        const result = await client.get('posts')
        if (result.status === 200) {
            console.log(result.data)
            result.data.map(item => {
                if (item.contentType === 'image/png' ||
					item.contentType === 'image/jpeg' ||
					item.contentType === 'image/jpg')
				{
                    const base64 = ('data:image/png;base64,' +
									item.content.split("'")[1])
                    item.imgSrc = base64
                }
                return item
            })
            setPostList(result.data)
        }
    }, []);

    // Get list on initialization
    useEffect(async () => {
        await getPostList()
    }, []);


    const uploadProps = {
      name: 'file',
      action: 'media/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    function handleChange(evt) {
        if (evt.target.value === "1" && !isMd) {
            setIsMd(!isMd);
            if (isBase) setIsBase(!isBase);
            if (isPng) setIsPng(!isPng);
            if (isJpeg) setIsJpeg(!isJpeg);
        }
        else if (evt.target.value === "2" && !isBase) {
            if (isMd) setIsMd(!isMd);
            setIsBase(!isBase);
            if (isPng) setIsPng(!isPng);
            if (isJpeg) setIsJpeg(!isJpeg);        }
        else if (evt.target.value === "3" && !isPng) {
            if (isMd) setIsMd(!isMd);
            if (isBase) setIsBase(!isBase);
            setIsPng(!isPng);
            if (isJpeg) setIsJpeg(!isJpeg);
        }
        else if (evt.target.value === "4" && !isJpeg) {
            if (isMd) setIsMd(!isMd);
            if (isBase) setIsBase(!isBase);
            if (isPng) setIsPng(!isPng);
            setIsJpeg(!isJpeg);        }
        else {
            if (isMd) setIsMd(!isMd);
            if (isBase) setIsBase(!isBase);
            if (isPng) setIsPng(!isPng);
            if (isJpeg) setIsJpeg(!isJpeg);
        }
    }

    return (
        <div className='home w1200'>
            <div className='today'>
            </div>

            <Form {...layout}
				name="nest-messages"
				onFinish={sendPost}
				onFieldsChange={checkContent}
				form={postForm}>

                <Form.Item
					name='title'
					label="Title"
					rules={[{required: true}]}>
                    <Input placeholder="please input your post's title"/>
                </Form.Item>

				<Form.Item
					label='Content Type?'>
                    <Radio.Group defaultValue="0" buttonStyle="solid" onChange={handleChange}>
                      <Radio.Button value="0">Utf-8</Radio.Button>
                      <Radio.Button value="1">Common Mark</Radio.Button>
                      <Radio.Button value="2">Base64</Radio.Button>
                      <Radio.Button value="3">PNG</Radio.Button>
                      <Radio.Button value="4">JPEG</Radio.Button>
                    </Radio.Group>
				</Form.Item>
                
                {
                    (isPng || isJpeg) ? (
                        <Form.Item>
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Form.Item>
                    ) : (
                        <Form.Item
                            name='content'
                            label="Post Text"
                            rules={[{required: true}]}>
                            <Input.TextArea placeholder="please input your post's text"/>
                        </Form.Item>
                    )
                }

				{isMd && hasContent ? (
				<Form.Item label='Preview'>
					<Card><div style={{
						paddingTop: '0.2em',
						paddingBottom: '0.2em',
						paddingLeft: '0.4em',
						paddingRight: '0.4em'}}>
					{previewText}</div></Card>
				</Form.Item>
				) : null}

                <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                    <Button
						type="primary"
						htmlType="submit"
						loading={isLoading}>
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
                    //         description={item.content}
                    //         />
                    // </Card>
                    <Card onClick={() => {
                        const param = window.btoa(JSON.stringify(item))
                        history.push(`/individualpost/${param}`)
                    }}>
                        <Card.Header
                            title={
                                <div style={{marginLeft: 10, fontSize: 14}}>
                                    {item.author.displayName}
                                </div>
                            }
                            thumb={
                                <img
                                    style={{width: 35, borderRadius: 10}}
                                    src={require('../../assets/user.jpg').default}
                                />
                            }
                            thumbStyle={{width: 35, borderRadius: 10}}
                        />
                        <Card.Body>
                            <h4>{item.title}</h4>
                            <div style={{marginBottom: '3px'}}>
                                {
                                    (item.contentType === 'image/png' &&
									 item.contentType === 'image/jpeg' &&
									 item.contentType === 'image/jpg') ?
                                        <img src={item.imgSrc} width={'100%'}/>
									: item.contentType === 'text/markdown' ?
										(<Remark
											remarkPlugins={[ remarkGemoji ]}
											rehypeReactOptions={{
												components: { li: customLi }
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
                                    <div style={{marginLeft: 10, display: 'inline-block'}}>
                                        { item.foreignNodeId ? `Source: ${item.foreignNodeHost}` : ''}
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
</Card> */
}
