import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    message,
} from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

const { Option } = Select
/*
The default sub-route of product
*/
export default class ProductHome extends Component {

    state = {
        total: 0, // total page numbers
        products: [], // product array
        loading: false, // loading status
        searchName: '', // search keyword
        searchType: 'productName', // search type as name or description
    }

    /*
    initialize columns in table
    */
    initColumns = () => {
        this.columns = [
            {
                title: 'Product Name',
                dataIndex: 'name',
            },
            {
                title: 'Description',
                dataIndex: 'desc',
            },
            {
                title: 'Price',
                dataIndex: 'price',
                render: (price) => '$' + price, // if set dataIndex, the param is its corresponding value
            },
            {
                width: 100,
                align: 'center',
                title: 'Status',
                // dataIndex: 'status',
                render: (product) => {
                    const { status, _id } = product
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={() => this.updateStatus(_id, newStatus)}
                            >
                                {status === 1 ? 'Unavailable' : 'Available'}
                            </Button>
                            <span>
                                {status === 1 ? 'Available' : 'Unavailable'}
                            </span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                align: 'center',
                title: 'Action',
                render: (product) => {
                    return (
                        <span>
                            {/* pass product to component as state */}
                            <LinkButton
                                onClick={() => this.props.history.push('/product/detail', { product })}
                            >
                                Detail
                            </LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>Change</LinkButton>
                        </span>
                    )
                }
            },
        ]
    }

    /*
    request products in certain page
    */
    getProducts = async (pageNum) => {
        // store page number, export to other function
        this.pageNum = pageNum
        this.setState({ loading: true }) // show loading

        const { searchName, searchType } = this.state
        let result
        if (searchName) { // keyword is valid, search page
            result = await reqSearchProducts({
                pageNum,
                pageSize: PAGE_SIZE,
                searchName,
                searchType
            })
        } else { // general page request
            result = await reqProducts(pageNum, PAGE_SIZE)
        }

        this.setState({ loading: false }) // end loading
        if (result.status === 0) {
            const { total, list } = result.data
            this.setState({
                total,
                products: list,
            })
        }
    }

    // update product status
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('Success update status')
            this.getProducts(this.pageNum)
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {

        const {
            total,
            products,
            loading,
            searchName,
            searchType,
        } = this.state

        const title = (
            <span>
                <Select
                    value={searchType}
                    onChange={value => this.setState({ searchType: value })}
                    style={{ width: 150 }}
                >
                    <Option value='productName'>Name</Option>
                    <Option value='productDesc'>Description</Option>
                </Select>
                <Input
                    placeholder='Enter keyword'
                    value={searchName}
                    onChange={event => this.setState({ searchName: event.target.value })}
                    style={{ width: 150, margin: '0 15px' }}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>Search</Button>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <PlusCircleOutlined />
                Add Product
            </Button>
        )



        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    loading={loading}
                    rowKey='_id'
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts,
                        current: this.pageNum,
                    }}
                />
            </Card>
        )
    }
}
