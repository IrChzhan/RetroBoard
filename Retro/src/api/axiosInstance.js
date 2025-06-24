import axios from 'axios'
import { refreshToken as refreshApi } from './auth.js'

const API_BASE = 'http://localhost:8080'

const instance = axios.create({
    baseURL: API_BASE
})
instance.interceptors.request.use(
    function(config) {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers.Authorization = 'Bearer ' + token
        }
        return config
    },
    function(error) {
        return Promise.reject(error)
    }
)

// Обновление токена при 401
instance.interceptors.response.use(
    function(response) {
        return response
    },
    async function(error) {
        const originalRequest = error.config

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const storedRefreshToken = localStorage.getItem('refreshToken')
                if (!storedRefreshToken) throw new Error('No refresh token found')

                const res = await refreshApi(storedRefreshToken)

                localStorage.setItem('accessToken', res.accessToken)
                localStorage.setItem('refreshToken', res.refreshToken)
                localStorage.setItem('expiresAt', res.expiresAt)

                originalRequest.headers.Authorization = 'Bearer ' + res.accessToken
                return instance(originalRequest)
            } catch (refreshError) {
                localStorage.clear()
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default instance