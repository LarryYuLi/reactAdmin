import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    Button,
    message,
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import { reqCategories, reqAddOrUpdateProduct } from '../../api'

const { Item } = Form
const { TextArea } = Input

/*
Add or update router of product
*/
const ProductAddUpdate = (props) => {

    const [options, setOptions] = useState([])
    const [imgs, setImgs] = useState([])
    const [detail, setDetail] = useState('')
    const [product, setProduct] = useState({})
    const [isUpdate, setIsUpdate] = useState(false)

    const pw = useRef(null)
    const editor = useRef(null)

    const [form] = Form.useForm()

    // category cascader 
    const categoryIds = []

    // Item layout config
    const formItemLayout = {
        labelCol: { span: 5 }, // label width
        wrapperCol: { span: 8 }, // wrapper width
    }

    const onFinish = async values => {

        // get product information
        const { name, desc, price, categoryIds } = values
        let pCategoryId, categoryId
        if (categoryIds.length === 1) {
            pCategoryId = '0'
            categoryId = categoryIds[0]
        } else {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }

        const imgs = pw.current.getImgs()
        const detail = editor.current.getDetail()
        setImgs(imgs)
        setDetail(detail)

        const newProduct = { name, desc, price, imgs, detail, pCategoryId, categoryId }

        if (isUpdate) { // if update, add _id into product
            newProduct._id = product._id
        }
        // send request to add/update product
        const result = await reqAddOrUpdateProduct(newProduct)

        if (result.status === 0) {
            message.success(`${isUpdate ? 'Update' : 'Add'} product successful`)
            props.history.goBack()
        } else {
            message.error(`${isUpdate ? 'Update' : 'Add'} product failed`)
        }
    }

    // generate options array, update options state
    const initOptions = async categories => {
        const options = categories.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))
        const product = props.location.state
        const isUpdate = !!product

        // if it needs to load second level category list
        if (isUpdate) {
            const { pCategoryId } = product
            if (pCategoryId !== '0') {
                // get second level gate
                const subCategories = await getCategories(pCategoryId)
                const childOptions = subCategories.map(c => ({
                    value: c._id,
                    label: c.name,
                    isLeaf: true,
                }))
                // get and connect to first level option
                const targetOption = options.find(option => option.value === pCategoryId)
                targetOption.children = childOptions
            }
        }

        setOptions(options)
    }

    // get category list
    const getCategories = async parentId => {
        const result = await reqCategories(parentId)
        if (result.status === 0) {
            const categories = result.data
            if (parentId === '0') { // first level category list
                initOptions(categories)
            } else { // second level category list
                return categories // return as promise
            }
        }
    }

    // load cascader
    const loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true

        // get second level category list by selected option
        const subCategories = await getCategories(targetOption.value)
        targetOption.loading = false

        if (subCategories && subCategories.length > 0) {
            // generate children options
            const childOptions = subCategories.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            targetOption.children = childOptions
        } else {
            targetOption.isLeaf = true
        }
        setOptions([...options])
    }

    const dispatchGetCategories = useCallback(getCategories, [])

    useEffect(() => {
        if (options.length === 0) { // avoid calling itself
            dispatchGetCategories('0')
        }
        const data = props.location.state // to add, the data is undefined
        // judge update or add 
        setIsUpdate(!!data)
        if (isUpdate) {
            const product = data
            setProduct(product)
            form.setFieldsValue({
                name: product.name,
                desc: product.desc,
                price: product.price,
                categoryIds,
            })
            const { pCategoryId, categoryId } = product
            // imgs = product.imgs
            // detail = product.detail
            setImgs(product.imgs)
            setDetail(product.detail)
            if (pCategoryId === '0') { // first level category
                categoryIds.push(categoryId)
            } else { // first and second level categories
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
    }, [props, options, isUpdate, categoryIds, form, dispatchGetCategories])

    const title = (
        <span>
            <LinkButton onClick={props.history.goBack}>
                <ArrowLeftOutlined style={{ fontSize: 20 }} />
            </LinkButton>
            <span>
                {isUpdate ? 'Update' : 'Add'} Product
            </span>
        </span>
    )

    return (
        <Card title={title}>
            <Form
                {...formItemLayout}
                form={form}
                onFinish={onFinish}
            >
                <Item
                    name='name'
                    label='Product name'
                    rules={[{ required: true, message: 'Must enter product name' }]}
                >
                    <Input placeholder='Please enter product name' />
                </Item>
                <Item
                    name='desc'
                    label='Product description'
                    rules={[{ required: true, message: 'Must enter product description' }]}
                >
                    <TextArea
                        placeholder='Please enter product description'
                        autoSize={{ minRows: 2, maxRows: 6 }}
                    />
                </Item>
                <Item
                    name='price'
                    label='Product price'
                    rules={[{ required: true, message: 'Must enter product price' }]}
                >
                    <Input
                        type='number'
                        prefix='$'
                        placeholder='Please enter product price'
                        min={0}
                    />
                </Item>
                <Item
                    name='categoryIds'
                    label='Product category'
                    placeholder='Please select'
                    rules={[{ required: true, message: 'Must choose product category' }]}
                >
                    <Cascader
                        options={options}
                        loadData={loadData}
                    />
                </Item>
                <Item name='pw' label='Product pictures'>
                    <PicturesWall ref={pw} imgs={imgs} />
                </Item>
                <Item
                    label='Product detail'
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 20 }}
                >
                    <RichTextEditor ref={editor} detail={detail} />
                </Item>
                <Item>
                    <Button type='primary' htmlType="submit">Submit</Button>
                </Item>
            </Form>
        </Card>
    )
}

export default ProductAddUpdate