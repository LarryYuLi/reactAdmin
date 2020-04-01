import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Table,
} from 'antd'
import { PlusCircleOutlined, ArrowRightOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button'

const { Option } = Select
/*
The default sub-route of product
*/
export default class ProductHome extends Component {

    state = {
        products: [
            {
                status: 1, 
                _id: 123, 
                name: 'Larry', 
                desc: 'Handsome man', 
                price: 9999999,
            }
        ], // product array
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
                dataIndex: 'status',
                render: (status) => {
                    return (
                        <span>
                            <Button type='primary'>Sold Out</Button>
                            <span>Available</span>
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
                            <LinkButton>Detail</LinkButton>
                            <LinkButton>Change</LinkButton>
                        </span>
                    )
                }
            },
        ]
    }

    componentWillMount() {
        this.initColumns()
    }

    render() {

        const { products } = this.state

        const title = (
            <span>
                <Select value='1' style={{ width: 150 }}>
                    <Option value='1'>Search by name</Option>
                    <Option value='2'>Search by descript</Option>
                </Select>
                <Input placeholder='Enter keyword' style={{ width: 150, margin: '0 15px' }} />
                <Button type='primary'>Search</Button>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <PlusCircleOutlined />
                Add Product
            </Button>
        )



        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={products}
                    columns={this.columns}
                />
            </Card>
        )
    }
}
