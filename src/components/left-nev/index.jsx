import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';

import logo from '../../assets/images/logo.png'
import menuList from "../../config/menuConfig"
import './index.less'

const { SubMenu } = Menu;
/*
Left navigation component
*/

class LeftNav extends Component {
    /*
    generate array of tags from menu list
    map() + recursion
    */ 
    getMenuNodes = (menuList) => {
        return menuList.map(item => {
            /*
            {
                title: '', key: '', icon: '', children(optional): []
            }

            <Menu.Item key="/home">
                <Link to='/home'>
                    <PieChartOutlined />
                    <span>Home</span>
                </Link>
            </Menu.Item>
            <SubMenu
                key="sub1"
                title={
                    <span>
                        <MailOutlined />
                        <span>Products</span>
                    </span>
                }
            >
                <Menu.Item key="/category">
                    <Link to='/category'>
                        <span>
                            <MailOutlined />
                            <span>Category</span>
                        </span>
                    </Link>
                </Menu.Item>
            </SubMenu>
            */

            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                // current route path
                const path = this.props.location.pathname
                const exist = item.children.find(cItem => cItem.key === path)
                if (exist) {
                    this.openKey = item.key
                }
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                {item.icon}
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                )
            }
        })
    }

    // before first render, sychronized
    componentWillMount() {
        // get menu nodes
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        
        // current route path
        const path = this.props.location.pathname
        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="" />
                    <h1>Management</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[this.openKey]}
                    mode="inline"
                    theme="dark"
                >
                    { this.menuNodes }
                </Menu>
            </div>
        )
    }
}

/*
withRouter will pass updated match, location, and history props 
to the wrapped component whenever it renders.
*/
export default withRouter(LeftNav)