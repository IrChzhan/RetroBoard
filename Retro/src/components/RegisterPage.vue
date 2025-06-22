<template>
  <div class="auth-container">
    <h2>Регистрация</h2>
    <input v-model="nickname" placeholder="Никнейм" />
    <input v-model="login" placeholder="Логин" />
    <input v-model="password" type="password" placeholder="Пароль" />
    <button @click="handleRegister">Зарегистрироваться</button>
    <p>Уже есть аккаунт? <router-link to="/login">Вход</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '../api/auth.js'

const nickname = ref('')
const login = ref('')
const password = ref('')
const router = useRouter()

async function handleRegister() {
  try {
    const res = await registerUser({ nickname: nickname.value, login: login.value, password: password.value })

    localStorage.setItem('accessToken', res.accessToken)
    localStorage.setItem('refreshToken', res.refreshToken)
    localStorage.setItem('expiresAt', res.expiresAt)

    router.push('/dashboard')
  } catch (err) {
    alert('Ошибка регистрации: ' + (err.response?.data?.message || err.message))
  }
}
</script>

<style scoped>
@import '../styles/auth.css';
</style>