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

// Добавить компонент на доску
export async function addComponentToBoard(boardId, componentData) {
    const res = await axios.post(`/boards/${boardId}/components`, componentData)
    return res.data
}

// Получить все компоненты доски
export async function getBoardComponents(boardId) {
    const res = await axios.get(`/boards/${boardId}/components`)
    return res.data
}

// Изменить компонент
export async function updateComponent(componentId, componentData) {
    const res = await axios.patch(`/components/${componentId}`, componentData)
    return res.data
}

// Удалить компонент
export async function deleteComponent(componentId) {
    const res = await axios.delete(`/components/${componentId}`)
    return res.data
}

// Проголосовать за компонент
export async function voteForComponent(componentId) {
    const res = await axios.post(`/components/${componentId}/vote`)
    return res.data
}

// Удалить голос за компонент
export async function deleteVoteForComponent(componentId) {
    const res = await axios.delete(`/components/${componentId}/vote`)
    return res.data
}

// Получить список ресурсов по типу
export async function getSvgTemplatesByType(type) {
    const res = await axios.get(`/svg-template?type=${type}`) // Добавил query параметр
    return res.data
}

// Получить ресурс по ID
export async function getSvgTemplateById(id) {
    const res = await axios.get(`/svg-template/${id}`)
    return res.data
}

// Получить список всех ресурсов
export async function getAllSvgTemplates() {
    const res = await axios.get('/svg-template/all')
    return res.data
}