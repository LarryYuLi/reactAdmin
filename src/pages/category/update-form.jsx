import React, { useEffect } from 'react'
import {
    Form,
    Input,
} from 'antd'

const { Item } = Form

const UpdateForm = (props) => {
    const [form] = Form.useForm()
    const {categoryName, setForm} = props

    useEffect(() => { // componentDidMount
        // update current category
        form.setFieldsValue({categoryName: categoryName})
    })

    useEffect(() => { 
        // deliver form to parent component
        setForm(form)
    })

    return (
        <Form
            name='updateForm'
            // initialValues={categoryName}
            form={form}
        >
            <Item
                name='categoryName'
                rules={[
                    {required: true, message: 'Must enter category name'}
                ]}
            >
                <Input
                    placeholder='Please enter category name'
                />
            </Item>
        </Form>
    )
}


export default UpdateForm
