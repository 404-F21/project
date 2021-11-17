import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { List, Card, Icon, NavBar } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Form, Input, InputNumber, } from 'antd';
import { loginAction } from '../../store/actions'
import './index.css';
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

const User = ({ messData }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const edit = () => {
        setIsModalVisible(true);
    }
    const onFinish = (values) => {
        console.log(values);
        setIsModalVisible(false);
    };
    return (
        <div className="user">
            <div className="userinfo bgw">
                <img
                    className="userimg"
                    src={require('../../assets/user.jpg').default}
                    alt=""
                />
                <div>
                    <h2>username</h2>
                    <p>hello world</p>
                </div>
                <a className='edit' onClick={edit}>
                    <i className='iconfont icon-bianji'><span style={{ paddingLeft: 10 }}>Edit</span></i>
                </a>
            </div>
            <div className='posts'>
                <Card onClick={() => history.push('/individualpost')}>
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
                <Card onClick={() => history.push('/individualpost')}>
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
            </div>
            <Modal footer={null} title="Edit Userinfo" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form {...layout} name="nest-messages" onFinish={onFinish} >
                    <Form.Item name={['user', 'name']} label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['user', 'age']} label="Age" rules={[{ type: 'number', min: 0, max: 99 }]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item name={['user', 'website']} label="Website">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['user', 'introduction']} label="Introduction">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default User