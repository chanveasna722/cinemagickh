<template>
  <div v-if="visible" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <button @click="$emit('close')">✕</button>
      <h2>Book Tickets</h2>
      <button @click="confirm">Confirm</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean }>()
const emit = defineEmits(['close', 'confirm'])
const confirm = () => emit('confirm', {})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #1a1a2e;
  padding: 30px;
  border-radius: 16px;
  color: white;
}
</style>
