import React, { useState, useEffect } from 'react'
import {
    Form,
    Input,
    Tree,
} from 'antd'

import menuList from '../../config/menuConfig'
import { PropTypes } from 'prop-types';

const { Item } = Form

const AuthForm = (props) => {

    const { role, getMenus } = props

    const [checkedKeys, setCheckedKeys] = useState(role.menus)

    const formItemLayout = {
        labelCol: { span: 5 }, // label width
        wrapperCol: { span: 15 }, // wrapper width
    }

    const treeData = [{
        title: 'Platform Authorization',
        key: 'all',
        children: menuList
    }]

    // pass data to parent component

    const onCheck = (checkedKeys, info) => {
        // console.log('onCheck', checkedKeys, info)
        setCheckedKeys(checkedKeys)
        getMenus(checkedKeys)
    }

    useEffect(() => {
        const menus = props.role.menus
        setCheckedKeys(menus)
    }, [props])

    return (
        <Form
            name='authForm'
            // form={form}
            {...formItemLayout}
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
                onCheck={onCheck}
                treeData={treeData}
            />
        </Form>
    )
}

AuthForm.propTypes = {
    role: PropTypes.object,
    getMenus: PropTypes.func
}

export default AuthForm