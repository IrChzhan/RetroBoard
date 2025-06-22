import axios from 'axios'

const API_BASE = 'http://localhost:8080'

export async function registerUser({ nickname, login, password }) {
    const res = await axios.post(`${API_BASE}/auth/register`, {
        nickname,
        login,
        password
    })
    return res.data
}

export async function loginUser({ login, password }) {
    const res = await axios.post(`${API_BASE}/auth/login`, {
        login,
        password
    })
    return res.data
}

export async function refreshToken(refreshToken) {
    const res = await axios.post(`${API_BASE}/auth/refresh`, {
        refreshToken
    })
    return res.data
}