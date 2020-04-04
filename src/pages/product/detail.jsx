import React, { Component } from 'react'
import {
    Card,
    List,
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button';
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'
const { Item } = List
/*
Detail information of product
*/
export default class ProductDetail extends Component {

    state = {
        cName1: '', // first level category name
        cName2: '', // second level category name
    }

    async componentDidMount() {
        const { pCategoryId, categoryId } = this.props.location.state.product
        if (pCategoryId === '0') { // first level category
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({ cName1 })
        } else { // second level category
            /*
            efficiency is low, because second await executed after the fisrt one completed
            const result1 = await reqCategory(pCategoryId)
            const result2 = await reqCategory(categoryId)
            const cName1 = result1.data.name
            const cName2 = result2.data.name
            */
            // request all promises at same time
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }
    }

    render() {

        // get product from state
        const { name, desc, price, detail, imgs } = this.props.location.state.product
        const { cName1, cName2 } = this.state

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{ marginRight: 10, fontSize: 20 }} />
                </LinkButton>
                <span>Product Details</span>
            </span>
        )

        return (
            <Card
                title={title}
                className='product-detail'
            >
                <List>
                    <Item className='item'>
                        <span className='left'>Product name:</span>
                        <span>{name}}</span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>Product description:</span>
                        <span>{desc}}</span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>Product price:</span>
                        <span>{price}</span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>Product category:</span>
                        <span>{cName1} {cName2 ? ' --> ' + cName2 : ''}</span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>Product image:</span>
                        <span>
                            {
                                imgs.map(img => (
                                    <img
                                        key={img}
                                        className='product-img'
                                        src={BASE_IMG_URL + img}
                                        alt="img"
                                    />
                                ))
                            }

                        </span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>Product detail:</span>
                        <span dangerouslySetInnerHTML={{ __html: detail }}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
