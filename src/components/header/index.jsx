import React, { Component } from 'react'

import {formatDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import './index.less'
/*
Header component
*/

export default class Header extends Component {

    state = {
        currentTime: formatDate(Date.now()),
        main: '', // weather 
        icon: '', // weather icon
    }

    getTime = () => {
        // update time every second
        setInterval(() => {
            const currentTime = formatDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }

    // after first render()
    componentDidMount () {
        this.getTime()
    }

    render() {

        const {currentTime, main, icon} = this.state

        const {username} = memoryUtils.user

        return (
            <div className="header">
                <div className="header-top">
                    <span>Welcome, {username}}</span>
                    <a href="javascript:">Log out</a>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">Home</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <span><img src={icon} alt="weather"/></span>
                        <span>{main}</span>
                    </div>
                </div>
            </div>
        )
    }
}
