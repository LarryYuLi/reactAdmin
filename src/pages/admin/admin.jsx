import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import { connect } from 'react-redux'

import LeftNav from '../../components/left-nev'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../not-found/not-found'

// import './admin.less'

const { Footer, Sider, Content } = Layout;

/*
admin router component
*/


class Admin extends Component {
    render() {

        const user = this.props.user
        if (!user || !user._id) { // check status
            // jump to login page
            return <Redirect to='/login' />
        }

        return (
            <Layout style={{ minHeight: '100%' }}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header></Header>
                    <Content style={{ margin: 20, backgroundColor: '#fff' }}>
                        <Switch>
                            <Redirect exact from='/' to='/home' />
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Route component={NotFound} />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#ccc' }}>Yu(Larry) Li ©2020 Created by React</Footer>
                </Layout>
            </Layout>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    {}
)(Admin)