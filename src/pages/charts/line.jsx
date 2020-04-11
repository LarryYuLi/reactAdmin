import React, { Component } from 'react'
import { Card, Button } from 'antd'
import ReactEcharts from 'echarts-for-react'

/*
Line route
*/

export default class Line extends Component {

    state = {
        sales: [5, 20, 36, 10, 10, 20],
        inventorys: [6, 15, 46, 20, 20, 40]
    }

    getOption = () => {
        const { sales, inventorys } = this.state
        return {
            title: {
                text: 'Example'
            },
            tooltip: {}, legend: {
                data: ['Sales', 'Inventory']
            },
            xAxis: {
                data: ["Shirt", "Cardigan", "Chiffon", "Pants", "Heels", "Socks"]
            },
            yAxis: {}, series: [{
                name: 'Sales',
                type: 'line',
                data: sales
            }, {
                name: 'Inventory',
                type: 'line', 
                data: inventorys
            }]
        }
    }

    update = () => {
        const sales = this.state.sales.map(sale => sale + 1)
        const inventorys = this.state.inventorys.map(inventory => inventory - 1) 
        this.setState({
            sales,
            inventorys
        })
    }

    render() {
        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.update}>Update</Button>
                </Card>
                <Card title='Line Chart'>
                    <ReactEcharts option={this.getOption()} />
                </Card>
            </div>
        )
    }
}
