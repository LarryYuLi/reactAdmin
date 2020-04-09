import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message,
} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { formatDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api'
import UserForm from './user-form'

const {confirm} = Modal

/*
User route
*/

export default class User extends Component {

    state = {
        users: [], // user list
        roles: [], // role list
        isShow: false, // show check box
    }

    initColumns = () => {
        this.columns = [
            {
                title: 'Username',
                dataIndex: 'username'
            },
            {
                title: 'Email',
                dataIndex: 'email'
            },
            {
                title: 'Phone',
                dataIndex: 'phone'
            },
            {
                title: 'Registration Time',
                dataIndex: 'create_time',
                render: formatDate
            },
            {
                title: 'Role',
                dataIndex: 'role_id', 
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: 'Action',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>Change</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>Delete</LinkButton>
                    </span>
                )
            }
        ]
    }

    // initialize role name object by roles array
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }

    showAdd = () => {
        this.user = null // clean this.user
        this.setState({
            isShow: true
        })
    }

    showUpdate = user => {
        this.user = user
        this.setState({
            isShow: true
        })

    }
    
    // delete user
    deleteUser = user => {
        confirm({
            title: `Do you want to delete ${user.username}?`,
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
              const result = await reqDeleteUser(user._id)
              if (result.status === 0) {
                message.success('Delete user successful')
                this.getUsers()
              }
            },
            onCancel() {},
          })
    }

    addOrUpdateUser = async () => {
        const user = await this.form.validateFields()
        this.setState({isShow: false})
        this.form.resetFields()

        // judge update
        if (this.user) {
            user._id = this.user._id
        }

        const result = await reqAddOrUpdateUser(user)
        if (result.status === 0) {
            message.success(`${this.user ? 'Update' : 'Create'} user successful`)
            this.getUsers()
        }
    }

    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const {users, roles} = result.data
            this.initRoleNames(roles)
            this.setState({
                users, 
                roles
            })
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {

        const { users, roles, isShow } = this.state

        const title = <Button type='primary' onClick={this.showAdd}>Create User</Button>

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    // loading={loading}
                    dataSource={users}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                    }}
                />
                <Modal
                    title={this.user ? 'Update User' : 'Create User'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({ isShow: false })
                    }}
                >
                    <UserForm 
                        setForm={(form) => { this.form = form }}
                        roles={roles}
                        user={this.user || {}}
                    />
                </Modal>
            </Card>
        )
    }
}
