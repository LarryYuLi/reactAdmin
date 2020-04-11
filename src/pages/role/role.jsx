import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message,
} from 'antd'
import { connect } from 'react-redux'

import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import { formatDate } from '../../utils/dateUtils'
import { logout } from '../../redux/actions'
/*
Role route
*/

class Role extends Component {

    state = {
        roles: [], // role list
        role: {}, // current chosen role
        isShowAdd: false, // show add modal
        isShowAuth: false, // show set authorization modal
    }

    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }

    initColumns = () => {
        this.columns = [
            {
                title: 'Role name',
                dataIndex: 'name',
            },
            {
                title: 'Create time',
                dataIndex: 'create_time',
                render: (create_time) => formatDate(create_time)
            },
            {
                title: 'Authorization time',
                dataIndex: 'auth_time',
                render: formatDate
            },
            {
                title: 'Authorized by',
                dataIndex: 'auth_name',
            },
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }

    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({
                    role
                })
            }
        }
    }

    // add role
    addRole = async () => {
        try {
            const values = await this.form.validateFields()

            const { roleName } = values
            this.form.resetFields()

            const result = await reqAddRole(roleName)
            if (result.status === 0) {
                message.success('Add role successful')
                const role = result.data
                // const roles = [...this.state.roles]
                // roles.push(role)
                // this.setState({ roles, isShowAdd: false })
                this.setState(state => ({
                    roles: [...state.roles, role],
                    isShowAdd: false
                }))
            } else {
                message.error('Add role error')
            }
        } catch (error) {
            message.error('Add role error')
        }
    }

    // update role 
    updateRole = async () => {
        this.setState({ isShowAuth: false })
        const role = this.state.role
        // const menus = this.auth.current.menus

        role.menus = this.menus
        role.auth_time = Date.now()
        role.auth_name = this.props.user.username

        // request update role 
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            // if user update self authority, force log out
            if (role._id === this.props.user.role_id) {
                this.props.logout()
                message.success("Set current user's authorization successful, please login again")
            } else {
                message.success('Set authorization successful')
                // this.getRoles()
                this.setState({
                    roles: [...this.state.roles]
                })
            }
        } else {
            message.error('Set authorization error')
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {

        const { roles, role, isShowAdd, isShowAuth } = this.state

        const title = (
            <span>
                <Button
                    type='primary'
                    style={{ marginRight: 15 }}
                    onClick={() => this.setState({ isShowAdd: true })}
                >
                    Add Role
                </Button>
                <Button
                    type='primary'
                    disabled={!role._id}
                    onClick={() => this.setState({ isShowAuth: true })}
                >
                    Set Authorization
                </Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => {
                            this.setState({
                                role
                            })
                        }
                    }}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                    }}
                    onRow={this.onRow}
                />
                <Modal
                    title="Add Role"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({ isShowAdd: false })
                        this.form.resetFields()
                    }}
                >
                    <AddForm
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
                <Modal
                    title="Set Authorization"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({ isShowAuth: false })
                    }}
                >
                    <AuthForm role={role} getMenus={m => this.menus = m} />
                </Modal>
            </Card>
        )
    }
}

export default connect(
    state => ({user: state.user}), 
    {logout}
)(Role)