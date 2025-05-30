import request from './axios'

export function register(formData) {
    return request.post('/user/register', formData)
}

export function getUsers() {
    return request.get('/user/list')
}
