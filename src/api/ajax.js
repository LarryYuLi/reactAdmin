/*
send asynchronous ajax request
return promise object
*/
import axios from 'axios'
import { message } from 'antd'

const ajax = (url, data = {}, method = 'GET') => {
    // create instance of promise to handle resolve and reject
    return new Promise((resolve, _) => {
        let promise
        // 1. excute ajax request
        if (method === 'GET') { // GET request
            promise = axios.get(url, {
                params: data
            })
        } else { // POST request
            promise = axios.post(url, data)
        }
        // 2. onResolved
        promise
            .then(response => {
                resolve(response.data)
            })
            // 3. onRejected, shows error message, but does not reject
            .catch(error => {
                message.error('Request failed: ' + error.message)
            })
    })

}

export default ajax