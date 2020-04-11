import React, { Component } from 'react'
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import './login.less'
import logo from '../../assets/images/logo-login.png'
import { login } from '../../redux/actions'
/*
login router component
*/

const NormalLoginForm = (props) => {
    const onFinish = async values => {
        // console.log('Received values of form: ', values)
        const { username, password } = values

        // dispatch asynchronized action => ajax request, update state
        props.login(username, password)
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

class Login extends Component {

    render() {
        // if already logged in, jump to admin
        const user = this.props.user
        if (user && user._id) {
            return <Redirect to='/home' />
        }
        
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="" />
                    <h1>React: Content Management System</h1>
                </header>
                <section className="login-content">
                    <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>Username or password is invalid</div>
                    <h2>Login</h2>
                    <NormalLoginForm {...this.props} />
                </section>
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    { login }
)(Login)