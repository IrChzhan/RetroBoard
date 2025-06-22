<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content chat-style">
      <div class="modal-header">
        <h2>Обсуждение артефакта</h2>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body scrollable">
        <div class="emoji-preview">{{ item.emoji }} {{ item.shortDescription }}</div>
        <div v-for="(comment, idx) in comments" :key="idx" class="chat-message">
          {{ comment }}
        </div>
      </div>

      <div class="modal-footer chat-footer">
        <input v-model="newComment" placeholder="Оставьте комментарий..." @keyup.enter="addComment" />
        <button @click="addComment">Отправить</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: Object
})
const emit = defineEmits(['close'])

const comments = ref([])
const newComment = ref('')

function addComment() {
  if (newComment.value.trim()) {
    comments.value.push(newComment.value.trim())
    newComment.value = ''
  }
}
</script>

<style scoped>
.chat-style {
  max-height: 600px;
  display: flex;
  flex-direction: column;
}
.scrollable {
  flex: 1;
  overflow-y: auto;
  max-height: 300px;
  padding-right: 10px;
}
.chat-message {
  background: rgba(255,255,255,0.05);
  margin-bottom: 10px;
  padding: 8px 10px;
  border-radius: 5px;
}
.chat-footer {
  display: flex;
  gap: 10px;
}
.chat-footer input {
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #4a4a8a;
  background: rgba(0,0,0,0.3);
  color: white;
}
.chat-footer button {
  background: #6495ed;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
}
</style>