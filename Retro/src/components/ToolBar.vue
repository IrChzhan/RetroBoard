<template>
  <div class="toolbar">
    <div
      class="icon-wrapper"
      v-for="item in items"
      :key="item.emoji"
      @click="openModal(item)"
    >
      <div class="emoji">{{ item.emoji }}</div>
      <div class="counter">{{ item.count }}</div>
      <img v-if="item.svgSource" :src="item.svgSource" alt="SVG Template" class="svg-icon"> 
    </div>

    <ModalWindow
      v-if="showModal"
      :item="selectedItem"
      :isCommentModal="false"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import ModalWindow from './Modal.vue'
import { getSvgTemplatesByType } from '../api/boards'

const items = reactive([
  { emoji: '🌟', type: 'star', count: 3, svgSource: null },
  { emoji: '🪐', type: 'planet', count: 3, svgSource: null },
  { emoji: '💥', type: 'asteroid', count: 3, svgSource: null }
])

const showModal = ref(false)
const selectedItem = ref(null)

onMounted(async () => {
  for (const item of items) {
    try {
      const templates = await getSvgTemplatesByType(item.type)
      if (templates && templates.length > 0) {
        item.svgSource = templates[0].source
      }
    } catch (err) {
      console.error(`Ошибка загрузки SVG для ${item.type}:`, err)
    }
  }
})

function openModal(item) {
  if (item.count <= 0) return
  selectedItem.value = item
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function handleSubmit({ shortDescription, fullDescription, isAnonymous }) {
  const event = new CustomEvent('add-object', {
    detail: {
      type: selectedItem.value.type,
      shortDescription,
      fullDescription,
      isAnonymous,
      author: localStorage.getItem('userLogin')
    }
  })
  window.dispatchEvent(event)

  items.find(i => i.type === selectedItem.value.type).count--
  closeModal()
}
</script>

<style scoped>
.toolbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  margin-right: 100px;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  border-top: 1px solid rgba(100, 149, 237, 0.5);
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0.5);
}


.icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  font-size: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border-radius: 50%;
}

.icon-wrapper:hover {
  background: rgba(100, 149, 237, 0.2);
  transform: scale(1.1);
}

.emoji {
  transition: transform 0.2s;
}

.icon-wrapper:active .emoji {
  transform: scale(1.2);
}

.counter {
  position: absolute;
  top: 0;
  right: 5px;
  background: #e74c3c;
  color: white;
  font-size: 14px;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
</style>
