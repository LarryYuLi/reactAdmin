import React, { Component } from 'react'
import { Card, Table, Button, message, Modal } from 'antd'
import { PlusCircleOutlined, ArrowRightOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import { reqCategories, reqUpdateCategory, reqAddCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
/*
Category route
*/

export default class Category extends Component {

    state = {
        loading: false, // whether loading data
        categories: [], // category list
        subCategories: [], // second level category list
        parentId: '0', // current category list's parent id
        parentName: '', // current category list's parent name
        showStatus: 0, // show add/update confirm modal, 0: None, 1: show add, 2: show update
    }

    // initialize columns in table
    initColumns = () => {
        this.columns = [
            {
                title: 'Category Name',
                dataIndex: 'name',
            },
            {
                title: 'Action',
                width: 300,
                dataIndex: '',
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>Change</LinkButton>
                        {/* how to pass params to an event 
                            () => {event(params)}
                        */}
                        {
                            this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategories(category)}>View</LinkButton> : null
                        }
                    </span>
                ),
            },
        ]
    }

    /*
    asychrnoized get first/second level category list
    parentId: 
        1) if passed parentId, use the parentId
        2) unvalid parentId, use parentId in state
    */
    getCategories = async (parentId) => {
        // start loading data
        this.setState({ loading: true })
        parentId = parentId || this.state.parentId
        const result = await reqCategories(parentId)

        // finish loading data
        this.setState({ loading: false })

        if (result.status === 0) {
            const categories = result.data
            // update first level category list
            if (parentId === '0') {
                this.setState({ categories })
            } else {// update second level category list
                this.setState({ subCategories: categories })
            }
        } else {
            message.error('Get category list failed')
        }
    }

    // show the first level category list
    showCategories = () => {
        // update state to first level
        this.setState({
            parentId: '0',
            parentName: '',
            subCategories: [],
        })
    }

    showSubCategories = (category) => {
        // update state
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { // excute after update state
            // get second category list
            this.getCategories()
        })
    }

    // cancel: hide modal
    handleCancel = () => {
        this.setState({
            showStatus: 0
        })
    }

    // show add confirm modal
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    // show update confirm modal
    showUpdate = (category) => {
        // store category
        this.category = category
        // set state
        this.setState({
            showStatus: 2
        })
    }

    // add category
    addCategory = async () => {
        // validate form data
        try {
            const values = await this.form.validateFields()
            // close modal
            this.setState({
                showStatus: 0
            })

            // get data
            // const parentId = this.form.getFieldValue('parentId')
            // const categoryName = this.form.getFieldValue('categoryName')
            const {parentId, categoryName} = values

            // clear form fields
            this.form.resetFields()

            // request for adding category
            const result = await reqAddCategory({ categoryName, parentId })

            // status is success
            if (result.status === 0) {
                // the current category need to be rendered
                if (parentId === this.state.parentId) {
                    // render current category list
                    this.getCategories()
                }
                // to render first level, when add a fisrt level category in a second category
                else if (parentId === '0') {
                    this.getCategories('0')
                }
            }
        } catch (error) {
            message.error('Add category error: ' + error.message)
        }


    }

    // update category
    updateCategory = async () => {
        // validate form data
        try {
            const values = await this.form.validateFields()
            // close modal
            this.setState({
                showStatus: 0
            })

            // get data
            const categoryId = this.category._id
            // const categoryName = this.form.getFieldValue('categoryName')
            const { categoryName } = values

            // request for updating category
            const result = await reqUpdateCategory({ categoryName, categoryId })
            if (result.status === 0) {
                // render category list
                this.getCategories()
            }
        } catch (error) {
            message.error('Change category error: ' + error.message)
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        // ajax to get data
        this.getCategories()
    }

    render() {

        const {
            categories,
            subCategories,
            parentId,
            parentName,
            loading,
            showStatus
        } = this.state

        // get current category, avoid undefined
        const category = this.category || {}

        // card right title
        const title = parentId === '0' ? 'First level category' : (
            <span>
                <LinkButton onClick={this.showCategories}>First level category</LinkButton>
                <ArrowRightOutlined style={{ marginRight: 5 }} />
                <span>{parentName}</span>
            </span>
        )
        // card left title 
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <PlusCircleOutlined />
                Add
            </Button>
        )


        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={parentId === '0' ? categories : subCategories}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: 5,
                        showQuickJumper: true,
                    }}
                />
                <Modal
                    forceRender
                    title="Add Category"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categories={categories}
                        parentId={parentId}
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
                <Modal
                    // forceRender
                    title="Update Category"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name}
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
            </Card>
        )
    }
}
