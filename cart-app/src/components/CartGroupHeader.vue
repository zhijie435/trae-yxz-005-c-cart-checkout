<template>
  <div class="cart-group-header">
    <div
      v-if="isEditing"
      class="cart-group-header__checkbox"
      @click="handleSelect"
    >
      <div
        class="cart-group-header__checkbox-inner"
        :class="{
          'cart-group-header__checkbox-inner--checked': isAllSelected,
          'cart-group-header__checkbox-inner--partial': isPartialSelected
        }"
      >
        <svg v-if="isAllSelected" class="cart-group-header__check-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div v-else-if="isPartialSelected" class="cart-group-header__partial-line"></div>
      </div>
    </div>
    <div class="cart-group-header__content">
      <span class="cart-group-header__name">{{ groupName }}</span>
      <span class="cart-group-header__count">({{ selectedCount }}/{{ totalCount }})</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  groupName: {
    type: String,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  isAllSelected: {
    type: Boolean,
    default: false
  },
  isPartialSelected: {
    type: Boolean,
    default: false
  },
  selectedCount: {
    type: Number,
    default: 0
  },
  totalCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['select'])

function handleSelect() {
  emit('select')
}
</script>

<style scoped>
.cart-group-header {
  display: flex;
  align-items: center;
  padding: 12px 16px 8px;
  background-color: #f5f5f5;
}

.cart-group-header__checkbox {
  width: 44px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
}

.cart-group-header__checkbox-inner {
  width: 20px;
  height: 20px;
  border: 1.5px solid #d9d9d9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.cart-group-header__checkbox-inner--checked {
  background-color: #ff2442;
  border-color: #ff2442;
}

.cart-group-header__checkbox-inner--partial {
  background-color: #ff2442;
  border-color: #ff2442;
}

.cart-group-header__check-icon {
  width: 12px;
  height: 12px;
}

.cart-group-header__partial-line {
  width: 10px;
  height: 2px;
  background-color: #ffffff;
  border-radius: 1px;
}

.cart-group-header__content {
  display: flex;
  align-items: baseline;
  flex: 1;
  margin-left: 4px;
}

.cart-group-header__name {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
}

.cart-group-header__count {
  font-size: 12px;
  color: #999999;
  margin-left: 6px;
}
</style>
