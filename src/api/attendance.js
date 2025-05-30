import request from './axios'

export function sign(formData) {
    return request.post('/attendance/sign', formData)
}

export function getRecords() {
    return request.get('/attendance/records')
}
