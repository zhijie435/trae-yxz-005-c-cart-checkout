<template>
  <Teleport to="body">
    <div v-if="visible" class="edit-modal">
      <div class="edit-modal__mask" @click="handleClose"></div>
      <div class="edit-modal__content">
        <div class="edit-modal__header">
          <div class="edit-modal__title">修改规格</div>
          <div class="edit-modal__close" @click="handleClose">
            <svg class="edit-modal__close-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div v-if="item" class="edit-modal__body">
          <div class="edit-modal__product">
            <div class="edit-modal__product-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            <div class="edit-modal__product-info">
              <div class="edit-modal__product-name">{{ item.name }}</div>
              <div class="edit-modal__product-price">
                <span class="edit-modal__price-symbol">¥</span>
                <span class="edit-modal__price-value">{{ currentPrice }}</span>
                <span class="edit-modal__price-unit">/件</span>
              </div>
            </div>
          </div>

          <div class="edit-modal__section">
            <div class="edit-modal__section-title">规格</div>
            <div class="edit-modal__options">
              <div
                v-for="spec in specOptions"
                :key="spec"
                class="edit-modal__option"
                :class="{ 'edit-modal__option--active': selectedSpec === spec }"
                @click="selectSpec(spec)"
              >
                {{ spec }}
              </div>
            </div>
          </div>

          <div class="edit-modal__section">
            <div class="edit-modal__section-title">租期</div>
            <div class="edit-modal__options">
              <div
                v-for="period in periodOptions"
                :key="period"
                class="edit-modal__option"
                :class="{ 'edit-modal__option--active': selectedPeriod === period }"
                @click="selectPeriod(period)"
              >
                {{ period }}
              </div>
            </div>
          </div>

          <div class="edit-modal__section">
            <div class="edit-modal__section-title">数量</div>
            <div class="edit-modal__quantity">
              <span class="edit-modal__quantity-btn" @click="decreaseQuantity">-</span>
              <span class="edit-modal__quantity-value">{{ selectedQuantity }}</span>
              <span class="edit-modal__quantity-btn" @click="increaseQuantity">+</span>
            </div>
          </div>
        </div>

        <div class="edit-modal__footer">
          <div class="edit-modal__cancel-btn" @click="handleClose">取消</div>
          <div class="edit-modal__confirm-btn" @click="handleConfirm">确定</div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'confirm'])

const specOptions = ['颜色: 红色', '颜色: 蓝色', '颜色: 黑色', '颜色: 白色', '尺寸: S', '尺寸: M', '尺寸: L', '尺寸: XL']
const periodOptions = ['1天', '3天', '7天', '15天', '30天', '90天', '180天', '365天']

const selectedSpec = ref('')
const selectedPeriod = ref('')
const selectedQuantity = ref(1)

const currentPrice = computed(() => {
  if (!props.item || !props.item.priceMap) return props.item?.price ?? 0
  return props.item.priceMap[selectedPeriod.value] ?? props.item.price
})

watch(() => props.visible, (newVal) => {
  if (newVal && props.item) {
    selectedSpec.value = props.item.spec
    selectedPeriod.value = props.item.rentPeriod
    selectedQuantity.value = props.item.quantity
  }
}, { immediate: true })

function selectSpec(spec) {
  selectedSpec.value = spec
}

function selectPeriod(period) {
  selectedPeriod.value = period
}

function increaseQuantity() {
  if (selectedQuantity.value < 99) {
    selectedQuantity.value++
  }
}

function decreaseQuantity() {
  if (selectedQuantity.value > 1) {
    selectedQuantity.value--
  }
}

function handleClose() {
  emit('close')
}

function handleConfirm() {
  emit('confirm', {
    id: props.item.id,
    spec: selectedSpec.value,
    rentPeriod: selectedPeriod.value,
    quantity: selectedQuantity.value,
    price: currentPrice.value
  })
}
</script>

<style scoped>
.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.edit-modal__mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.edit-modal__content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.edit-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.edit-modal__title {
  font-size: 17px;
  font-weight: 600;
  color: #333333;
}

.edit-modal__close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.edit-modal__close-icon {
  width: 20px;
  height: 20px;
}

.edit-modal__body {
  padding: 16px 20px;
}

.edit-modal__product {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.edit-modal__product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #f5f5f5;
}

.edit-modal__product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-modal__product-info {
  flex: 1;
  margin-left: 12px;
  min-width: 0;
}

.edit-modal__product-name {
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

.edit-modal__product-price {
  margin-top: 8px;
  display: flex;
  align-items: baseline;
  color: #ff2442;
}

.edit-modal__price-symbol {
  font-size: 12px;
  font-weight: 500;
}

.edit-modal__price-value {
  font-size: 18px;
  font-weight: 600;
  margin-left: 1px;
}

.edit-modal__price-unit {
  font-size: 12px;
  color: #999999;
  margin-left: 2px;
  font-weight: 400;
}

.edit-modal__section {
  margin-bottom: 20px;
}

.edit-modal__section-title {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 12px;
}

.edit-modal__options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.edit-modal__option {
  padding: 8px 14px;
  background-color: #f5f5f5;
  border-radius: 20px;
  font-size: 13px;
  color: #666666;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.edit-modal__option--active {
  background-color: #fff1f0;
  color: #ff2442;
  border-color: #ff2442;
}

.edit-modal__quantity {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
  width: fit-content;
}

.edit-modal__quantity-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #666666;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}

.edit-modal__quantity-btn:active {
  background-color: #e8e8e8;
}

.edit-modal__quantity-value {
  width: 48px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: #333333;
  background-color: #ffffff;
}

.edit-modal__footer {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  border-top: 1px solid #f0f0f0;
  gap: 12px;
}

.edit-modal__cancel-btn {
  flex: 1;
  height: 44px;
  background-color: #f5f5f5;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 500;
  color: #666666;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}

.edit-modal__confirm-btn {
  flex: 1;
  height: 44px;
  background: linear-gradient(135deg, #ff6b35 0%, #ff2442 100%);
  border-radius: 22px;
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
</style>
