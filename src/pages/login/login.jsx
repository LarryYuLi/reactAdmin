import React, { Component } from 'react'
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { message } from 'antd'
import { Redirect } from 'react-router-dom'

import './login.less'
import logo from '../../assets/images/logo-login.png'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
/*
login router component
*/

const NormalLoginForm = ({ props }) => {
    const onFinish = async values => {
        // console.log('Received values of form: ', values)
        const { username, password } = values

        // result => response.data => {status: 0, data: user} or {status: 1, msg: ''}
        const result = await reqLogin(username, password) 
        // console.log('Success: ', response.data)
        
        const user = result.data
        memoryUtils.user = user // store user in memory
        storageUtils.saveUser(user) // store user in local

        if (result.status === 0) { // login success
            message.success('Login success')
            // console.log(self)
            // Jump to management page, don't have to go back
            props.history.replace('/')
        } else { // login failed
            message.error(result.msg)
        }
    }

    const onFinishFailed = error => {
        console.log('Failed: ', error)
    }

    // check password
    const validatePwd = (rule, value) => {
        if (!value) {
            return Promise.reject('Please input your Password!')
        } else if (value.length < 4) {
            return Promise.reject('The password must be 4 characters or more')
        } else if (value.length > 12) {
            return Promise.reject('The password must be 12 characters or less')
        } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
            return Promise.reject('The password must contain only letters, numbers, and hyphens/underscores')
        } else {
            return Promise.resolve()
        }
    }

    return ( // Ant Design Form
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                    {
                        min: 4,
                        message: 'The username must be 4 characters or more'
                    },
                    {
                        max: 12,
                        message: 'The username must be 12 characters or less'
                    },
                    {
                        pattern: /^[a-zA-Z0-9_-]+$/,
                        message: 'The username must contain only letters, numbers, and hyphens/underscores'
                    },
                ]}
            >
                <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Username"
                />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        validator: validatePwd,
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button" >
                    Log in
                </Button>
            </Form.Item>
        </Form>
    );
};

export default class Login extends Component {
    
    render() {
        // if already logged in, jump to admin
        const user = memoryUtils.user
        if (user && user._id) {
            return <Redirect to='/' />
        }

        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="" />
                    <h1>React: Content Management System</h1>
                </header>
                <section className="login-content">
                    <h2>Login</h2>
                    <NormalLoginForm props={this.props} />
                </section>
            </div>
        )
    }
}