<template>
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
</template>

<script setup>
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

const emit = defineEmits(['select', 'update:quantity', 'edit'])

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
.cart-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #ffffff;
  margin-bottom: 8px;
  border-radius: 8px;
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
</style>
