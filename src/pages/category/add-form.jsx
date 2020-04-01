import React, { useEffect } from 'react'
import {
    Form,
    Select,
    Input,
} from 'antd'

const { Item } = Form
const { Option } = Select

const AddForm = (props) => {
    const [form] = Form.useForm()
    const { categories, parentId, setForm } = props

    useEffect(() => {
        form.setFieldsValue({ parentId: parentId })
        setForm(form)
    })

    return (
        <Form
            name='addForm'
            form={form}
            // initialValues={{
            //     parentId: parentId
            // }}
        >
            <Item
                name='parentId'
            >
                <Select>
                    <Option value='0'>First level</Option>
                    {
                        categories.map(c =>
                            <Option value={c._id} key={c._id}>{c.name}</Option>
                        )
                    }
                </Select>
            </Item>


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

export default AddForm


// export default class AddForm extends Component {

//     static propTypes = {
//         categories: Proptypes.array.isRequired, 
//         parentId: Proptypes.string.isRequired, 
//     }

//     render() {
//         const {categories, parentId} = this.props

//         const onFinish = values => {
//             console.log('Received values from form: ', values)
//         }
//         console.log('test', this.props.form)

//         return (
//             <Form
//                 name='addForm'
//                 onFinish={onFinish}
//                 initialValues={{
//                     parentId: parentId
//                 }}
//             >
//                 <Item
//                     name='parentId'
//                 >
//                     <Select>
//                         <Option value='0'>First level</Option>
//                         {
//                             categories.map(c => 
//                                 <Option value={c._id} key={c._id}>First level</Option>)
//                         }
//                     </Select>
//                 </Item>


//                 <Item
//                     name='categoryName'
//                 >
//                     <Input
//                         placeholder='Please enter category name'
//                     />
//                 </Item>
//             </Form>
//         )
//     }
// }
