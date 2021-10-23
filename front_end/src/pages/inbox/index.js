import React from 'react'
import { List, Badge, NavBar, Icon } from 'antd-mobile';
import './index.css';
const Inbox = (props) => {
    return (
        <div className='inbox w1200'>

            <List style={{ marginTop: 10 }}>
                <List.Item extra="12:00" arrow="horizontal">
                    <Badge dot>
                        <img
                            style={{ height: '100%', borderRadius: '50%' }}
                            src={require('../../assets/user.jpg').default}
                        />
                    </Badge>
                    <span style={{ marginLeft: 12 }}>username</span>
                </List.Item>
                <List.Item extra="12:00" arrow="horizontal">
                    <Badge dot>
                        <img
                            style={{ height: '100%', borderRadius: '50%' }}
                            src={require('../../assets/user.jpg').default}
                        />
                    </Badge>
                    <span style={{ marginLeft: 12 }}>username</span>
                </List.Item>
                <List.Item extra="12:00" arrow="horizontal">
                    <Badge dot>
                        <img
                            style={{ height: '100%', borderRadius: '50%' }}
                            src={require('../../assets/user.jpg').default}
                        />
                    </Badge>
                    <span style={{ marginLeft: 12 }}>username</span>
                </List.Item>
                <List.Item extra="12:00" arrow="horizontal">
                    <Badge dot>
                        <img
                            style={{ height: '100%', borderRadius: '50%' }}
                            src={require('../../assets/user.jpg').default}
                        />
                    </Badge>
                    <span style={{ marginLeft: 12 }}>username</span>
                </List.Item>
            </List>
        </div>
    )
}

export default Inbox
