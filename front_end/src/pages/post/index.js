import React from 'react'
import { List, Badge, NavBar, Icon } from 'antd-mobile';
import { Form, Input, InputNumber, Button } from 'antd';
import {useHistory} from 'react-router-dom'
import './index.css';

const layout = {
    labelCol: {
      span: 12,
      offset: 6
    },
    wrapperCol: {
      span: 12,
      offset: 6
    },
  };
  const validateMessages = {
    required: '${label} is required!',
  };

const Post = (props) => {
    const history = useHistory();
    const onFinish = (values) => {
        history.push('/')
        console.log(values);
    };
    return (
        <div className='post w1200'>
            <Form {...layout} layout="vertical" name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                <Form.Item
                    name={['user', 'name']}
                    label="Title"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name={['user', 'introduction']} label="Content">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                    <Button shape="round" block type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Post
