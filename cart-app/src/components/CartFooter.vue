<template>
  <div class="cart-footer">
    <div
      class="cart-footer__select-all"
      @click="handleSelectAll"
    >
      <div class="cart-footer__checkbox" :class="{ 'cart-footer__checkbox--checked': isAllSelected }">
        <svg v-if="isAllSelected" class="cart-footer__check-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span class="cart-footer__select-text">全选</span>
    </div>

    <template v-if="!isEditing">
      <div class="cart-footer__total">
        <span class="cart-footer__total-label">合计：</span>
        <span class="cart-footer__total-price">
          <span class="cart-footer__total-symbol">¥</span>
          <span class="cart-footer__total-value">{{ totalPrice.toFixed(2) }}</span>
        </span>
      </div>
      <div
        class="cart-footer__checkout"
        :class="{ 'cart-footer__checkout--disabled': selectedCount === 0 }"
        @click="handleCheckout"
      >
        去结算({{ selectedCount }})
      </div>
    </template>

    <template v-else>
      <div class="cart-footer__actions">
        <div
          class="cart-footer__action-btn cart-footer__action-btn--secondary"
          :class="{ 'cart-footer__action-btn--disabled': selectedCount !== 1 }"
          @click="handleEditSpec"
        >
          修改规格
        </div>
        <div
          class="cart-footer__action-btn cart-footer__action-btn--danger"
          :class="{ 'cart-footer__action-btn--disabled': selectedCount === 0 }"
          @click="handleDelete"
        >
          删除({{ selectedCount }})
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  },
  isAllSelected: {
    type: Boolean,
    default: false
  },
  selectedCount: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['select-all', 'checkout', 'delete', 'edit-spec'])

function handleSelectAll() {
  emit('select-all')
}

function handleCheckout() {
  if (props.selectedCount > 0) {
    emit('checkout')
  }
}

function handleDelete() {
  if (props.selectedCount > 0) {
    emit('delete')
  }
}

function handleEditSpec() {
  if (props.selectedCount === 1) {
    emit('edit-spec')
  }
}
</script>

<style scoped>
.cart-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-top: 1px solid #f0f0f0;
  z-index: 100;
}

.cart-footer__select-all {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}

.cart-footer__checkbox {
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

.cart-footer__checkbox--checked {
  background-color: #ff2442;
  border-color: #ff2442;
}

.cart-footer__check-icon {
  width: 14px;
  height: 14px;
}

.cart-footer__select-text {
  margin-left: 8px;
  font-size: 14px;
  color: #333333;
}

.cart-footer__total {
  flex: 1;
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  margin-right: 12px;
}

.cart-footer__total-label {
  font-size: 14px;
  color: #333333;
}

.cart-footer__total-price {
  display: flex;
  align-items: baseline;
  color: #ff2442;
}

.cart-footer__total-symbol {
  font-size: 14px;
  font-weight: 500;
}

.cart-footer__total-value {
  font-size: 20px;
  font-weight: 600;
  margin-left: 1px;
}

.cart-footer__checkout {
  min-width: 110px;
  height: 40px;
  background: linear-gradient(135deg, #ff6b35 0%, #ff2442 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}

.cart-footer__checkout--disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.cart-footer__actions {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.cart-footer__action-btn {
  min-width: 80px;
  height: 36px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: all 0.2s ease;
}

.cart-footer__action-btn--secondary {
  background-color: #f5f5f5;
  color: #333333;
  border: 1px solid #e0e0e0;
}

.cart-footer__action-btn--danger {
  background-color: #ff2442;
  color: #ffffff;
}

.cart-footer__action-btn--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
