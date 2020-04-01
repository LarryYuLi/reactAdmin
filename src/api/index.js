/*
Includes all the API request model
Every function returns a promise
*/
import jsonp from 'jsonp'
import { message } from 'antd'
import ajax from './ajax'

// const BASE = 'http://localhost:5000'
const BASE = '' // proxy in package.json

// login
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

// add user
export const reqAddUser = user => ajax(BASE + '/manage/user/add', user, 'POST')

// get category list
export const reqCategories = (parentId) => ajax(BASE + 'manage/category/list', {parentId})

// add category
export const reqAddCategory = ({categoryName, parentId}) => ajax(BASE + 'manage/category/add', {categoryName, parentId}, 'POST')

// update category
export const reqUpdateCategory = ({categoryName, categoryId}) => ajax(BASE + 'manage/category/update', {categoryName, categoryId}, 'POST')

// json request api function
export const reqWeather = (city) => {

    return new Promise((resolve, reject) => {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=283d3ab33f23beae7bd2466d26c8bc66`
        jsonp(url, (err, data) => {
            console.log('jsonp()', err, data)
            if (!err) { // success
                let { main, icon } = data.weather[0]
                icon = `http://openweathermap.org/img/w/${icon}.png`
                resolve({ main, icon })
            } else { // failed
                message.error('Get weather failed')
            }
        })
    })
}