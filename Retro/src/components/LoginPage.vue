<template>
  <div class="auth-container">
    <h2>Вход</h2>
    <input v-model="login" placeholder="Логин" />
    <input v-model="password" type="password" placeholder="Пароль" />
    <button @click="handleLogin">Войти</button>
    <p>Нет аккаунта? <router-link to="/register">Регистрация</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '../api/auth.js'

const login = ref('')
const password = ref('')
const router = useRouter()

async function handleLogin() {
  try {
    const res = await loginUser({ login: login.value, password: password.value })

    localStorage.setItem('accessToken', res.accessToken)
    localStorage.setItem('refreshToken', res.refreshToken)
    localStorage.setItem('expiresAt', res.expiresAt)

    router.push('/dashboard')
  } catch (err) {
    alert('Ошибка входа: ' + (err.response?.data?.message || err.message))
  }
}
</script>

<style scoped>
@import '../styles/auth.css';
</style>