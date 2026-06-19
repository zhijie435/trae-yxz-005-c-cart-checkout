<template>
  <div class="cart-item-wrapper">
    <div
      class="cart-item-swipe"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
      :style="{ transform: `translateX(${offsetX}px)` }"
    >
      <div class="cart-item">
        <div
          v-if="isEditing"
          class="cart-item__checkbox"
          @click="handleSelect"
        >
          <div class="cart-item__checkbox-inner" :class="{ 'cart-item__checkbox-inner--checked': selected }">
            <svg v-if="selected" class="cart-item__check-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="cart-item__image">
          <img :src="item.image" :alt="item.name" />
        </div>
        <div class="cart-item__info">
          <div class="cart-item__name">{{ item.name }}</div>
          <div class="cart-item__specs">
            <span class="cart-item__spec">{{ item.spec }}</span>
            <span class="cart-item__divider">|</span>
            <span class="cart-item__spec">{{ item.rentPeriod }}</span>
          </div>
          <div class="cart-item__bottom">
            <div class="cart-item__price">
              <span class="cart-item__price-symbol">¥</span>
              <span class="cart-item__price-value">{{ item.price }}</span>
              <span class="cart-item__price-unit">/件</span>
            </div>
            <div class="cart-item__quantity">
              <span class="cart-item__quantity-btn" @click="handleDecrease">-</span>
              <span class="cart-item__quantity-value">{{ item.quantity }}</span>
              <span class="cart-item__quantity-btn" @click="handleIncrease">+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cart-item-delete" @click="showDeleteConfirm = true">
      <span class="cart-item-delete__text">删除</span>
    </div>

    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="delete-confirm">
        <div class="delete-confirm__mask" @click="showDeleteConfirm = false"></div>
        <div class="delete-confirm__dialog">
          <div class="delete-confirm__message">确认删除这个商品？</div>
          <div class="delete-confirm__actions">
            <div class="delete-confirm__btn delete-confirm__btn--cancel" @click="showDeleteConfirm = false">再想想</div>
            <div class="delete-confirm__btn delete-confirm__btn--confirm" @click="handleConfirmDelete">确定</div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'update:quantity', 'delete'])

const DELETE_BTN_WIDTH = 80
const THRESHOLD = 40

const offsetX = ref(0)
const startX = ref(0)
const startY = ref(0)
const isDragging = ref(false)
const isScrolling = ref(false)
const showDeleteConfirm = ref(false)

function onTouchStart(e) {
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
  isDragging.value = true
  isScrolling.value = false
}

function onTouchMove(e) {
  if (!isDragging.value) return
  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY
  const deltaX = currentX - startX.value
  const deltaY = currentY - startY.value

  if (!isScrolling.value && Math.abs(deltaY) > Math.abs(deltaX)) {
    isScrolling.value = true
    return
  }

  if (isScrolling.value) return

  e.preventDefault()
  let newOffset = offsetX.value + deltaX
  if (offsetX.value < 0) {
    newOffset = deltaX
  }
  if (newOffset > 0) newOffset = 0
  if (newOffset < -DELETE_BTN_WIDTH) newOffset = -DELETE_BTN_WIDTH
  offsetX.value = newOffset
  startX.value = currentX
}

function onTouchEnd() {
  isDragging.value = false
  snapOffset()
}

function onMouseDown(e) {
  startX.value = e.clientX
  startY.value = e.clientY
  isDragging.value = true
  isScrolling.value = false
}

function onMouseMove(e) {
  if (!isDragging.value) return
  const currentX = e.clientX
  const currentY = e.clientY
  const deltaX = currentX - startX.value
  const deltaY = currentY - startY.value

  if (!isScrolling.value && Math.abs(deltaY) > Math.abs(deltaX)) {
    isScrolling.value = true
    return
  }

  if (isScrolling.value) return

  let newOffset = offsetX.value + deltaX
  if (offsetX.value < 0) {
    newOffset = deltaX
  }
  if (newOffset > 0) newOffset = 0
  if (newOffset < -DELETE_BTN_WIDTH) newOffset = -DELETE_BTN_WIDTH
  offsetX.value = newOffset
  startX.value = currentX
}

function onMouseUp() {
  if (!isDragging.value) return
  isDragging.value = false
  snapOffset()
}

function snapOffset() {
  if (offsetX.value < -THRESHOLD) {
    offsetX.value = -DELETE_BTN_WIDTH
  } else {
    offsetX.value = 0
  }
}

function handleConfirmDelete() {
  showDeleteConfirm.value = false
  offsetX.value = 0
  emit('delete', props.item.id)
}

function handleSelect() {
  emit('select', props.item.id)
}

function handleIncrease() {
  emit('update:quantity', props.item.id, props.item.quantity + 1)
}

function handleDecrease() {
  if (props.item.quantity > 1) {
    emit('update:quantity', props.item.id, props.item.quantity - 1)
  }
}
</script>

<style scoped>
.cart-item-wrapper {
  position: relative;
  margin-bottom: 8px;
  overflow: hidden;
  border-radius: 8px;
}

.cart-item-swipe {
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
  background-color: #ffffff;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

.cart-item__checkbox {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
}

.cart-item__checkbox-inner {
  width: 22px;
  height: 22px;
  border: 1.5px solid #d9d9d9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.cart-item__checkbox-inner--checked {
  background-color: #ff2442;
  border-color: #ff2442;
}

.cart-item__check-icon {
  width: 14px;
  height: 14px;
}

.cart-item__image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #f5f5f5;
}

.cart-item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item__info {
  flex: 1;
  margin-left: 12px;
  min-width: 0;
}

.cart-item__name {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.cart-item__specs {
  margin-top: 6px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999999;
}

.cart-item__spec {
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
}

.cart-item__divider {
  margin: 0 6px;
  color: #e0e0e0;
}

.cart-item__bottom {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cart-item__price {
  display: flex;
  align-items: baseline;
  color: #ff2442;
}

.cart-item__price-symbol {
  font-size: 12px;
  font-weight: 500;
}

.cart-item__price-value {
  font-size: 18px;
  font-weight: 600;
  margin-left: 1px;
}

.cart-item__price-unit {
  font-size: 12px;
  color: #999999;
  margin-left: 2px;
  font-weight: 400;
}

.cart-item__quantity {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
}

.cart-item__quantity-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #666666;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}

.cart-item__quantity-btn:active {
  background-color: #e8e8e8;
}

.cart-item__quantity-value {
  width: 36px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #333333;
  background-color: #ffffff;
}

.cart-item-delete {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  background-color: #ff2442;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.cart-item-delete__text {
  font-size: 15px;
  font-weight: 500;
  color: #ffffff;
}

.delete-confirm {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-confirm__mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
}

.delete-confirm__dialog {
  position: relative;
  width: 280px;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  animation: dialogFadeIn 0.2s ease;
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.delete-confirm__message {
  padding: 28px 24px 20px;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  text-align: center;
  line-height: 24px;
}

.delete-confirm__actions {
  display: flex;
  border-top: 1px solid #f0f0f0;
}

.delete-confirm__btn {
  flex: 1;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: background-color 0.15s ease;
}

.delete-confirm__btn:active {
  background-color: #f5f5f5;
}

.delete-confirm__btn--cancel {
  color: #666666;
  border-right: 1px solid #f0f0f0;
}

.delete-confirm__btn--confirm {
  color: #ff2442;
  font-weight: 500;
}
</style>
