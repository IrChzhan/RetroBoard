<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isCommentModal ? 'Комментарии к артефакту' : 'Добавить артефакт ретроспективы' }}</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="modal-body">
        <div class="emoji-preview">{{ item?.emoji }}</div>

        <div v-if="!isCommentModal" class="form-group">
          <label for="short-description">Краткое описание (до 30 символов):</label>
          <input
            id="short-description"
            v-model="shortDescription"
            placeholder="Краткое описание"
            maxlength="30"
          />
        </div>

        <div v-if="!isCommentModal" class="form-group">
          <label for="full-description">Полное описание:</label>
          <textarea
            id="full-description"
            v-model="fullDescription"
            placeholder="Подробное описание артефакта..."
          ></textarea>
        </div>

        <div v-if="isCommentModal" class="artifact-details">
          <div class="artifact-likes">
            <button
              :class="{ active: userReaction === 'like' }"
              @click="likeArtifact"
            >👍 {{ item?.likes }}</button>
            <button
              :class="{ active: userReaction === 'dislike' }"
              @click="dislikeArtifact"
            >👎 {{ item?.dislikes }}</button>
          </div>

          <div class="comments-section">
            <div class="comments-list">
              <div v-for="(comment, index) in item?.comments" :key="index" class="comment">
                <div class="comment-author">{{ comment.isAnonymous ? 'Аноним' : comment.author }}</div>
                <div class="comment-text">{{ comment.text }}</div>
                <div class="comment-time">{{ comment.time }}</div>
              </div>
            </div>
            <div class="new-comment">
              <input
                v-model="newComment"
                placeholder="Написать комментарий..."
                @keyup.enter="addComment"
              />
              <button @click="addComment">Отправить</button>
            </div>
          </div>
        </div>

        <div v-if="!isCommentModal" class="form-group checkbox-container">
          <label class="checkbox-label">
            <input type="checkbox" v-model="isAnonymous" />
            <span class="checkmark"></span>
            Отправить анонимно
          </label>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-btn" @click="close">Отмена</button>
        <button v-if="!isCommentModal" class="submit-btn" @click="submit">Добавить</button>
        <button v-if="isCommentModal" class="submit-btn" @click="saveChanges">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isCommentModal: {
    type: Boolean,
    default: false
  },
  update: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])

const shortDescription = ref('')
const fullDescription = ref('')
const isAnonymous = ref(false)
const newComment = ref('')

const userReaction = ref(null) 

const localItem = computed({
  get: () => props.item,
  set: (value) => props.update(value)
})

// Уникальный ключ реакции
const reactionKey = computed(() => props.item ? `reaction-${props.item.id}` : null)

// Чтение реакции из localStorage при открытии
function loadUserReaction() {
  if (reactionKey.value) {
    const stored = localStorage.getItem(reactionKey.value)
    if (stored === 'like' || stored === 'dislike') {
      userReaction.value = stored
    } else {
      userReaction.value = null
    }
  }
}

watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      shortDescription.value = newItem.shortDescription || ''
      fullDescription.value = newItem.fullDescription || ''
      isAnonymous.value = newItem.isAnonymous || false
      loadUserReaction()
    }
  },
  { immediate: true }
)

function close() {
  emit('close')
}

function submit() {
  if (!shortDescription.value.trim() || !fullDescription.value.trim()) {
    alert('Пожалуйста, заполните оба описания')
    return
  }

  emit('submit', {
    shortDescription: shortDescription.value,
    fullDescription: fullDescription.value,
    isAnonymous: isAnonymous.value
  })
}

function addComment() {
  if (!newComment.value.trim()) return

  if (localItem.value && localItem.value.comments) {
    localItem.value.comments.push({
      author: 'Вы',
      text: newComment.value,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAnonymous: isAnonymous.value
    })

    props.update(localItem.value)
  }

  newComment.value = ''
}

function likeArtifact() {
  if (!localItem.value || !reactionKey.value) return

  if (userReaction.value === 'like') {
    localItem.value.likes--
    userReaction.value = null
    localStorage.removeItem(reactionKey.value)
  } else {
    if (userReaction.value === 'dislike') {
      localItem.value.dislikes--
    }
    localItem.value.likes++
    userReaction.value = 'like'
    localStorage.setItem(reactionKey.value, 'like')
  }

  props.update(localItem.value)
}

function dislikeArtifact() {
  if (!localItem.value || !reactionKey.value) return

  if (userReaction.value === 'dislike') {
    localItem.value.dislikes--
    userReaction.value = null
    localStorage.removeItem(reactionKey.value)
  } else {
    if (userReaction.value === 'like') {
      localItem.value.likes--
    }
    localItem.value.dislikes++
    userReaction.value = 'dislike'
    localStorage.setItem(reactionKey.value, 'dislike')
  }

  props.update(localItem.value)
}

function saveChanges() {
  props.update(localItem.value)
  close()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  border: 1px solid #4a4a8a;
  box-shadow: 0 0 30px rgba(100, 149, 237, 0.5);
  overflow: hidden;
  color: white;
}

.modal-header {
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid #4a4a8a;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #6495ed;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
}

.close-btn:hover {
  color: #e74c3c;
}

.modal-body {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.emoji-preview {
  font-size: 3rem;
  text-align: center;
  margin: 10px 0 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #6495ed;
}

input[type="text"],
input[type="text"]:focus,
textarea {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #4a4a8a;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  resize: vertical;
}

input[type="text"]:focus,
textarea:focus {
  outline: none;
  border-color: #6495ed;
  box-shadow: 0 0 5px rgba(100, 149, 237, 0.5);
}

textarea {
  min-height: 100px;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #4a4a8a;
  background: rgba(0, 0, 0, 0.3);
  color: white;
}

input:focus {
  outline: none;
  border-color: #6495ed;
  box-shadow: 0 0 5px rgba(100, 149, 237, 0.5);
}

.checkbox-container {
  margin-top: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-left: 20px;
}

.checkbox-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  left: 0;
}

.checkbox-label:hover input ~ .checkmark {
  background-color: rgba(100, 149, 237, 0.2);
}

.checkbox-label input:checked ~ .checkmark {
  background-color: #6495ed;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-label input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-label .checkmark:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.modal-footer {
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid #4a4a8a;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-footer button {
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.cancel-btn {
  background: none;
  border: 1px solid #e74c3c;
  color: #e74c3c;
}

.cancel-btn:hover {
  background: rgba(231, 76, 60, 0.1);
}

.submit-btn {
  background: #6495ed;
  border: 1px solid #6495ed;
  color: white;
}

.submit-btn:hover {
  background: #4a7bc8;
  box-shadow: 0 0 5px rgba(100, 149, 237, 0.5);
}

.artifact-details {
  margin-top: 20px;
}

.artifact-likes {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.artifact-likes button {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  padding: 8px 15px;
  border-radius: 5px;
}

.artifact-likes button:hover {
  background: rgba(100, 149, 237, 0.2);
}

.artifact-likes button.active {
  background: rgba(100, 149, 237, 0.4);
  border: 1px solid #6495ed;
  border-radius: 5px;
}

.comments-section {
  margin-top: 20px;
}

.comments-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 15px;
  border: 1px solid #4a4a8a;
  border-radius: 5px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
}

.comment {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(74, 74, 138, 0.5);
}

.comment:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.comment-author {
  font-weight: bold;
  color: #6495ed;
  font-size: 0.9rem;
}

.comment-text {
  margin: 5px 0;
  font-size: 0.95rem;
}

.comment-time {
  font-size: 0.8rem;
  color: #aaa;
  text-align: right;
}

.new-comment {
  display: flex;
  gap: 10px;
}

.new-comment input {
  flex-grow: 1;
  padding: 8px 12px;
}

.new-comment button {
  background: #6495ed;
  border: none;
  color: white;
  padding: 0 15px;
  border-radius: 5px;
  cursor: pointer;
}

.new-comment button:hover {
  background: #4a7bc8;
}
</style>