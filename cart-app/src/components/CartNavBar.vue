<template>
  <div class="cart-navbar">
    <div class="cart-navbar__left" @click="handleBack">
      <svg class="cart-navbar__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="cart-navbar__title">购物车</div>
    <div class="cart-navbar__right" @click="handleManage">
      <span class="cart-navbar__manage">{{ props.isEditing ? '完成' : '管理' }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['back', 'manage'])

function handleBack() {
  emit('back')
}

function handleManage() {
  emit('manage', !props.isEditing)
}
</script>

<style scoped>
.cart-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 12px;
  background-color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 100;
  user-select: none;
  -webkit-user-select: none;
}

.cart-navbar__left {
  width: 40px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
}

.cart-navbar__icon {
  width: 22px;
  height: 22px;
  color: #333333;
}

.cart-navbar__title {
  font-size: 17px;
  font-weight: 600;
  color: #333333;
  line-height: 44px;
}

.cart-navbar__right {
  width: 40px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
}

.cart-navbar__manage {
  font-size: 14px;
  color: #333333;
  white-space: nowrap;
}
</style>
