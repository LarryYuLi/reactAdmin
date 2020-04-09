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

// get category list
export const reqCategories = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

// add category
export const reqAddCategory = ({categoryName, parentId}) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')

// update category
export const reqUpdateCategory = ({categoryName, categoryId}) => ajax(BASE + '/manage/category/update', {categoryName, categoryId}, 'POST')

// get category name by id
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

// product page list
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

// update product status, available or not
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')

// search products list, by product name, or by product description
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
    pageNum, 
    pageSize, 
    [searchType]: searchName,
})

// delete image in update-add
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

// add product information
export const reqAddOrUpdateProduct = (product) => 
    ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

// get role list
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// add role
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')

// update role
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

// get user list
export const reqUsers = () => ajax(BASE + '/manage/user/list')

// delete user
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')

// add or update user
export const reqAddOrUpdateUser = user => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

// json request api function
export const reqWeather = (city) => {

    return new Promise((resolve, reject) => {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=283d3ab33f23beae7bd2466d26c8bc66`
        jsonp(url, (err, data) => {
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