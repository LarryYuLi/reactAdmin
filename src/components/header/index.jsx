import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import LinkButton from '../link-button'
import { formatDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig'
import storageUtils from '../../utils/storageUtils'
import './index.less'
/*
Header component
*/

class Header extends Component {

    state = {
        currentTime: formatDate(Date.now()),
        main: '', // weather 
        icon: '', // weather icon
    }

    // update time every second
    getTime = () => {
        this.intervalId = setInterval(() => {
            const currentTime = formatDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }

    // call api to get weather data
    getWeather = async (city) => {
        const { main, icon } = await reqWeather(city)
        this.setState({ main, icon, city })
    }

    // get title of current route, recursive 
    getTitle = (list) => {
        const path = this.props.location.pathname
        let title
        list.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const cTitle = this.getTitle(item.children)
                if (cTitle) {
                    title = cTitle
                }
            }
        })
        return title
    }

    // get title of current route 
    getTitle1 = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => cItem.key === path)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    // log out
    logout = () => {
        // confirmation dialog
        Modal.confirm({
            title: 'Do you Want to Log Out?',
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
                // delete user data,
                storageUtils.removeUser()
                memoryUtils.user = {}
                
                // jump to login
                this.props.history.replace('/login')
            },
          })
    }

    // unload component
    componentWillMount () {
        // clear interval
        clearInterval(this.intervalId)
    }

    // after first render()
    componentDidMount () {
        this.getTime()
        this.getWeather('San Jose')
    }

    render() {

        const { currentTime, main, icon, city } = this.state

        const { username } = memoryUtils.user

        const title = this.getTitle(menuList)
        // const title = this.getTitle1()

        return (
            <div className="header">
                <div className="header-top">
                    <span>Welcome, {username}</span>
                    <LinkButton onClick={this.logout}>Log out</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span className="header-bottom-right-time">{currentTime}</span>
                        <span>{city}</span>
                        <span><img src={icon} alt="weather" /></span>
                        <span>{main}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
