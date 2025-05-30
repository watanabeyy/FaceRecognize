import request from './axios'

export function login(data) {
    return request.post('/auth/login', data)
}
