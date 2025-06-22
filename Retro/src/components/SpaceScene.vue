<template>
  <div>
    <div
      v-for="obj in objects"
      :key="obj.id"
      class="object-container"
      :style="{ left: obj.x + 'px', top: obj.y + 'px' }"
      @mousedown="startHtmlDrag($event, obj)"
    >
      <div class="emoji">{{ obj.emoji }}</div>
      <div class="short-description">{{ obj.shortDescription }}</div>
      <button class="open-button" @click="openCommentModal(obj)">Открыть</button>
    </div>

    <ModalWindow
      v-if="showModal"
      :item="selectedItem"
      :isCommentModal="true"
      @close="closeModal"
      @update="updateObject"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import ModalWindow from './Modal.vue'

const objects = reactive([])
const showModal = ref(false)
const selectedItem = ref(null)

let isDraggingHtml = false
let draggedObject = null
let dragOffsetHtml = { x: 0, y: 0 }

onMounted(() => {
  window.addEventListener('add-object', handleAddObject)
  window.addEventListener('resize', () => {}) 
})

function handleAddObject(e) {
  const { type, shortDescription, fullDescription, isAnonymous } = e.detail

  const emoji = {
    star: '🌟',
    planet: '🪐',
    asteroid: '💥'
  }[type]


  const x = window.innerWidth / 2
  const y = (window.innerHeight - 100) / 2

  objects.push({
    id: Date.now(),
    emoji,
    type,
    x,
    y,
    shortDescription,
    fullDescription,
    isAnonymous,
    likes: 0,
    dislikes: 0,
    comments: []
  })
}

function startHtmlDrag(e, obj) {
  isDraggingHtml = true
  draggedObject = obj
  dragOffsetHtml = {
    x: e.clientX - obj.x,
    y: e.clientY - obj.y
  }

  window.addEventListener('mousemove', onHtmlDrag)
  window.addEventListener('mouseup', stopHtmlDrag)

  e.preventDefault()
}

function onHtmlDrag(e) {
  if (!isDraggingHtml || !draggedObject) return

  draggedObject.x = e.clientX - dragOffsetHtml.x
  draggedObject.y = e.clientY - dragOffsetHtml.y

  updateObjectPosition(draggedObject.id, draggedObject.x, draggedObject.y)
}

function stopHtmlDrag() {
  if (isDraggingHtml) {
    isDraggingHtml = false
    draggedObject = null
    window.removeEventListener('mousemove', onHtmlDrag)
    window.removeEventListener('mouseup', stopHtmlDrag)
  }
}

function updateObjectPosition(id, x, y) {
  const index = objects.findIndex(obj => obj.id === id)
  if (index !== -1) {
    objects[index].x = x
    objects[index].y = y
  }
}

function openCommentModal(obj) {
  selectedItem.value = obj
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedItem.value = null
}

function updateObject(updatedObject) {
  const index = objects.findIndex(obj => obj.id === updatedObject.id)
  if (index !== -1) {
    objects[index] = updatedObject
  }
}
</script>

<style scoped>
.object-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
}

.emoji {
  font-size: 42px;
  text-align: center;
  color: white;
  text-shadow: 0 0 15px #6495ed;
}

.short-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.open-button {
  background: #6495ed;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 5px;
}

.open-button:hover {
  background: #4a7bc8;
}
</style>