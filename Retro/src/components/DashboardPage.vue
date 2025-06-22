<template>
  <div class="dashboard">
    <h2>Мои ретроспективы</h2>

    <div class="board-list">
      <div class="board-item" v-for="board in boards" :key="board.id">
        <div @click="goToBoard(board.id)" class="board-title">📝 {{ board.title }}</div>
        <div class="board-id">
           ID: <code>{{ board.id }}</code>
        </div>

      </div>
    </div>

    <button @click="createNewBoard">➕ Добавить новую доску</button>
    <button class="logout-btn" @click="logout">Выйти</button>

    <div class="invite-access">
      <h3>🔗 Инвайт-доступ к доске по названию</h3>

      <div class="token-block">
        <input v-model="inviteTitle" placeholder="Название моей доски" />
        <button @click="generateToken">Получить инвайт-токен</button>
        <p v-if="generatedToken">
          Токен: <code>{{ generatedToken }}</code>
          <button class="copy-btn" @click="copyToClipboard(generatedToken)">📋</button>
        </p>
      </div>

      <div class="token-block">
        <input v-model="joinTitle" placeholder="Название чужой доски" />
        <input v-model="inputToken" placeholder="Инвайт-токен" />
        <button @click="joinByToken">Подключиться к доске</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getMyBoards,
  createBoard,
  deleteBoard,
  getBoardIdByTitle,
  getInviteTokenByBoardId,
  requestAccessByToken,
  getBoardById
} from '../api/boards'

const router = useRouter()
const boards = ref([])

const inviteTitle = ref('')
const generatedToken = ref(null)

const joinTitle = ref('')
const inputToken = ref('')

onMounted(async () => {
  try {
    boards.value = await getMyBoards()
  } catch (err) {
    alert('Ошибка загрузки досок: ' + (err.response?.data?.message || err.message))
  }
})

function logout() {
  localStorage.clear()
  router.push('/login')
}

function copyToClipboard(value) {
  navigator.clipboard.writeText(value)
    .then(() => alert('Скопировано в буфер обмена!'))
    .catch(err => alert('Ошибка копирования: ' + err))
}


async function createNewBoard() {
  const title = prompt('Название новой доски:')
  if (!title) return
  try {
    const newBoard = await createBoard(title)
    boards.value.push(newBoard)
  } catch (err) {
    alert('Ошибка создания доски: ' + (err.response?.data?.message || err.message))
  }
}

function goToBoard(id) {
  router.push(`/board/${id}`)
}

async function generateToken() {
  try {
    const boardId = await getBoardIdByTitle(inviteTitle.value)
    const token = await getInviteTokenByBoardId(boardId)
    generatedToken.value = token
  } catch (err) {
    alert('Ошибка получения токена: ' + (err.response?.data?.message || err.message))
  }
}

async function joinByToken() {
  try {
    const boardId = await getBoardIdByTitle(joinTitle.value)
    await requestAccessByToken(boardId, inputToken.value)
    const board = await getBoardById(boardId)
    boards.value.push(board)
    alert(`Вы подключились к доске "${board.title}"`)
  } catch (err) {
    alert('Ошибка подключения: ' + (err.response?.data?.message || err.message))
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 600px;
  margin: 50px auto;
  color: white;
  background: rgba(0, 0, 0, 0.4);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(100, 149, 237, 0.5);
}

.board-list {
  margin-top: 20px;
}

.board-item {
  padding: 10px;
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 5px;
  border-left: 4px solid #6495ed;
}

.board-title {
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 5px;
}

.board-id {
  font-size: 0.85rem;
  color: #ccc;
  word-break: break-all;
}

button {
  margin-top: 20px;
  padding: 10px;
  background: #6495ed;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background: #4a7bc8;
}

.logout-btn {
  margin-top: 20px;
  background: #e74c3c;
}

.logout-btn:hover {
  background: #c0392b;
}

.invite-access {
  margin-top: 40px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  border: 1px solid #6495ed;
  color: white;
  box-shadow: 0 0 10px rgba(100, 149, 237, 0.4);
}

.invite-access h3 {
  color: #6495ed;
  margin-bottom: 15px;
}

.token-block {
  margin-bottom: 20px;
}

.token-block input {
  width: 100%;
  margin: 6px 0;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #6495ed;
  border-radius: 5px;
  color: white;
}

.token-block input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.token-block button {
  width: 100%;
  padding: 10px;
  background: #6495ed;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.token-block button:hover {
  background: #4a7bc8;
}

.copy-btn {
  margin-left: 10px;
  background: none;
  border: none;
  color: #6495ed;
  cursor: pointer;
  font-size: 1rem;
}

.copy-btn:hover {
  color: #a0c4ff;
}

</style>
