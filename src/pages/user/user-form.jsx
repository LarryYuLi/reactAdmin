import React, { useEffect } from 'react'
import {
    Form,
    Input,
    Select,
} from 'antd'

const { Item } = Form
const { Option } = Select

const UserForm = (props) => {
    const [form] = Form.useForm()
    const { setForm, roles, user } = props

    useEffect(() => {
        setForm(form)
        form.resetFields()
    })

    const formItemLayout = {
        labelCol: { span: 5 }, // label width
        wrapperCol: { span: 15 }, // wrapper width
    }

    return (
        <Form
            name='addForm'
            form={form}
            {...formItemLayout}
            initialValues={user}
        >
            <Item
                name='username'
                label='Username:'
                rules={[
                    { required: true, message: 'Must enter username' }
                ]}
            >
                <Input
                    placeholder='Please enter username'
                />
            </Item>
            {
                user._id ? null : (
                    <Item
                        name='password'
                        label='Password:'
                        rules={[
                            { required: true, message: 'Must enter password' }
                        ]}
                    >
                        <Input
                            type='password'
                            placeholder='Please enter password'
                        />
                    </Item>
                )
            }
            <Item
                name='phone'
                label='Phone:'
            >
                <Input
                    placeholder='Please enter phone number'
                />
            </Item>
            <Item
                name='email'
                label='Email:'
            >
                <Input
                    placeholder='Please enter email'
                />
            </Item>
            <Item
                name='role_id'
                label='Role:'
                rules={[
                    { required: true, message: 'Must select a role' }
                ]}
            >
                <Select placeholder='Please select a role'>
                    {
                        roles.map(
                            role => (
                                <Option
                                    key={role._id}
                                    value={role._id}
                                >
                                    {role.name}
                                </Option>
                            )
                        )
                    }
                </Select>
            </Item>
        </Form>
    )
}

export default UserForm