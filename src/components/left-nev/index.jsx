import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd'
import { connect } from 'react-redux'

import logo from '../../assets/images/logo.png'
import menuList from "../../config/menuConfig"
import { setHeadTitle } from '../../redux/actions'
import './index.less'

const { SubMenu } = Menu;
/*
Left navigation component
*/

class LeftNav extends Component {

    // whether current user has authroity for item
    hasAuth = item => {
        const { key, isPublic } = item
        const menus = this.props.user.role.menus
        const username = this.props.user.username
        // 1. admin: full control, return true
        // 2. if item is public, return true
        // 3. current user: if the key is in menus
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) { // 4. user has authority of sub-item
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false
    }

    /*
    generate array of tags from menu list
    map() + recursion
    */
    getMenuNodes = (menuList) => {
        // current route path
        const path = this.props.location.pathname
        return menuList.map(item => {
            // show components according to user's authority
            if (this.hasAuth(item)) {
                if (!item.children) {
                    // whether the item is current item
                    if (item.key === path || path.indexOf(item.key) === 0) {
                        this.props.setHeadTitle(item.title)
                    }
                    return (
                        <Menu.Item key={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                            <Link to={item.key}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                } else {
                    const exist = item.children.find(cItem => path.indexOf(cItem.key) === 0)
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
            }
            return null
        })
    }

    // before first render, sychronized
    UNSAFE_componentWillMount() {
        // get menu nodes
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {

        // current route path
        let path = this.props.location.pathname
        if (path.indexOf('/product') === 0) {
            path = '/product'
        }
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
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}

/*
withRouter will pass updated match, location, and history props 
to the wrapped component whenever it renders.
*/
export default connect(
    state => ({user: state.user}),
    { setHeadTitle }
)(withRouter(LeftNav))