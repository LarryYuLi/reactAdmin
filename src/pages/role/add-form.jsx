import React, { useEffect } from 'react'
import {
    Form,
    Input,
} from 'antd'

const { Item } = Form

const AddForm = (props) => {
    const [form] = Form.useForm()
    const { setForm } = props

    useEffect(() => {
        setForm(form)
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
        >
            <Item
                name='roleName'
                label='Role name:'
                rules={[
                    {required: true, message: 'Must enter role name'}
                ]}
            >
                <Input
                    placeholder='Please enter role name'
                />
            </Item>
        </Form>
    )
}

export default AddForm