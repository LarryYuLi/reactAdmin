import React from 'react'
import ReactDOM from 'react-dom'
// import 'antd/dist/antd.css'

import App from './app'
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

// get user from local memory
const user = storageUtils.getUser()
memoryUtils.user = user

// render App
ReactDOM.render(<App />, document.getElementById('root'))
