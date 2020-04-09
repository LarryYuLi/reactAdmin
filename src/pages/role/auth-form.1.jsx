import React, { Component } from 'react'
import {
    Form,
    Input,
    Tree,
} from 'antd'

import menuList from '../../config/menuConfig'
import { PropTypes } from 'prop-types';

const { Item } = Form

export default class AuthForm extends Component {

    static propTypes = {
        role: PropTypes.object
    }

    constructor(props) {
        super(props)
        const { menus } = this.props.role
        this.state = {
            checkedKeys: menus
        }
        console.log(this.props.role.menus)
    }

    formItemLayout = {
        labelCol: { span: 5 }, // label width
        wrapperCol: { span: 15 }, // wrapper width
    }

    treeData = [{
        title: 'Platform Authorization',
        key: 'all',
        children: menuList
    }]

    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info)
        this.setState({
            checkedKeys
        })
    }

    getMenus = () => this.state.checkedKeys

    render() {
        const { role } = this.props
        const { checkedKeys } = this.state

        return (
            <Form
                name='authForm'
                {...this.formItemLayout}
                fields={[{ name: 'roleName', value: role.name }]}
            >
                <Item
                    name='roleName'
                    label='Role name:'
                >
                    <Input disabled />
                </Item>

                <Tree
                    checkable
                    defaultExpandAll
                    checkedKeys={checkedKeys}
                    // onSelect={onSelect}
                    onCheck={this.onCheck}
                    treeData={this.treeData}
                />
            </Form>
        )
    }

}


