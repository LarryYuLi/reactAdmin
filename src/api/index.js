/*
Includes all the API request model
Every function returns a promise
*/
// import jsonp from 'jsonp'
import {message} from 'antd'
import ajax from './ajax'

// const BASE = 'http://localhost:5000'
const BASE = '' // proxy in package.json

// login
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')

// add user
export const reqAddUser = user => ajax(BASE + '/manager/user/add', user, 'POST')

// json request api function
// export const reqWeather = (city) => {

//     return new Promise((resolve, reject) => {
//         const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&id=283d3ab33f23beae7bd2466d26c8bc66`
//         jsonp(url, (err, data) => {
//             console.log('jsonp()', err, data)
//             if (!err && data.cod === '200') { // success
//                 const {main, icon} = data.weather[0]
//                 resolve({main, `"http://openweathermap.org/img/w/" + ${icon} + ".png"`})
//             } else { // failed
//                 message.error('Get weather failed')
//             }
//         })

//     })
// }