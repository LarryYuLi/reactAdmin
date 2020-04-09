import React from 'react'
import {
    HomeOutlined,
    AppstoreOutlined,
    BarsOutlined,
    ToolOutlined,
    UserOutlined,
    SafetyCertificateOutlined,
    AreaChartOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined
} from '@ant-design/icons';

const home = <HomeOutlined />
const products = <AppstoreOutlined />
const category = <BarsOutlined />
const product = <ToolOutlined />
const user = <UserOutlined />
const role = <SafetyCertificateOutlined />
const area_chart = <AreaChartOutlined />
const bar_chart = <BarChartOutlined />
const line_chart = <LineChartOutlined />
const pie_chart = <PieChartOutlined />

const menuList = [
    {
        title: 'Home',
        key: '/home',
        icon: home,
        isPublic: true, 
    },
    {
        title: 'Products',
        key: '/products',
        icon: products,
        children: [
            {
                title: 'Category',
                key: '/category',
                icon: category
            },
            {
                title: 'Product',
                key: '/product',
                icon: product
            },
        ]
    },
    {
        title: 'User',
        key: '/user',
        icon: user
    },
    {
        title: 'Role',
        key: '/role',
        icon: role
    },
    {
        title: 'Charts',
        key: '/charts',
        icon: area_chart,
        children: [
            {
                title: 'Bar',
                key: '/charts/bar',
                icon: bar_chart
            }, {
                title: 'Line',
                key: '/charts/line',
                icon: line_chart
            }, {
                title: 'Pie',
                key: '/charts/pie',
                icon: pie_chart
            },
        ]
    }
]

export default menuList