// api/boards.js
import axios from './axiosInstance'

// Получить доски пользователя
export async function getMyBoards() {
    const res = await axios.get('/boards/me')
    return res.data
}

// Получить доску по ID
export async function getBoardById(id) {
    const res = await axios.get(`/boards/${id}`)
    return res.data
}

// Создать доску
export async function createBoard(title) {
    const res = await axios.post('/boards', { title })
    return res.data
}

// Удалить доску
export async function deleteBoard(id) {
    const res = await axios.delete(`/boards/${id}`)
    return res.data
}

// Найти ID доски по названию
export async function getBoardIdByTitle(title) {
    const boards = await getMyBoards()
    const board = boards.find(b => b.title === title)
    if (!board) throw new Error('Доска с таким названием не найдена')
    return board.id
}

// Получить токен по ID доски
export async function getInviteTokenByBoardId(boardId) {
    const res = await axios.get(`/boards/${boardId}/invite`)
    return res.data.token
}

// Отправить токен для подключения к доске
export async function requestAccessByToken(boardId, token) {
    const res = await axios.post(`/boards/${boardId}/invite`, { token })
    return res.data
}