<script setup>
import { ref, computed } from 'vue'
import CartNavBar from './components/CartNavBar.vue'
import CartItem from './components/CartItem.vue'
import CartFooter from './components/CartFooter.vue'
import EditSpecModal from './components/EditSpecModal.vue'

const cartList = ref([
  {
    id: 1,
    name: 'Apple iPhone 15 Pro Max 256GB 原色钛金属',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=iPhone%2015%20Pro%20Max%20smartphone%20product%20photo%20on%20white%20background&image_size=square',
    spec: '颜色: 原色钛金属',
    rentPeriod: '30天',
    price: 39.9,
    quantity: 1,
    priceMap: { '1天': 5.9, '3天': 14.9, '7天': 24.9, '15天': 34.9, '30天': 39.9, '90天': 99.9, '180天': 179.9, '365天': 329.9 }
  },
  {
    id: 2,
    name: 'Sony WH-1000XM5 无线降噪头戴耳机 黑色',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Sony%20WH-1000XM5%20wireless%20headphones%20black%20product%20photo&image_size=square',
    spec: '颜色: 黑色',
    rentPeriod: '7天',
    price: 15.9,
    quantity: 2,
    priceMap: { '1天': 3.9, '3天': 9.9, '7天': 15.9, '15天': 24.9, '30天': 39.9, '90天': 89.9, '180天': 159.9, '365天': 279.9 }
  },
  {
    id: 3,
    name: 'MacBook Pro 14英寸 M3 Pro 18GB 512GB 深空灰色',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=MacBook%20Pro%2014%20inch%20laptop%20space%20gray%20product%20photo&image_size=square',
    spec: '尺寸: 14英寸',
    rentPeriod: '90天',
    price: 89.9,
    quantity: 1,
    priceMap: { '1天': 9.9, '3天': 19.9, '7天': 39.9, '15天': 59.9, '30天': 79.9, '90天': 89.9, '180天': 159.9, '365天': 279.9 }
  },
  {
    id: 4,
    name: 'DJI Mini 4 Pro 航拍无人机 畅飞套装',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=DJI%20Mini%204%20Pro%20drone%20with%20controller%20product%20photo&image_size=square',
    spec: '版本: 畅飞套装',
    rentPeriod: '3天',
    price: 49.9,
    quantity: 1,
    priceMap: { '1天': 19.9, '3天': 49.9, '7天': 79.9, '15天': 109.9, '30天': 159.9, '90天': 329.9, '180天': 599.9, '365天': 999.9 }
  }
])

const isEditing = ref(false)
const selectedIds = ref(new Set())
const showEditModal = ref(false)
const editingItem = ref(null)

const isAllSelected = computed(() => {
  return cartList.value.length > 0 && selectedIds.value.size === cartList.value.length
})

const selectedCount = computed(() => selectedIds.value.size)

const totalPrice = computed(() => {
  return cartList.value
    .filter(item => selectedIds.value.has(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const platformDiscount = computed(() => {
  const price = totalPrice.value
  if (price >= 200) return 30
  if (price >= 100) return 10
  if (price >= 50) return 5
  return 0
})

const finalPrice = computed(() => {
  return Math.max(0, totalPrice.value - platformDiscount.value)
})

const selectedItemCount = computed(() => {
  return cartList.value
    .filter(item => selectedIds.value.has(item.id))
    .reduce((sum, item) => sum + item.quantity, 0)
})

function handleBack() {
  console.log('返回')
}

function handleManage(editing) {
  isEditing.value = editing
  if (!editing) {
    selectedIds.value = new Set()
  }
}

function handleSelect(id) {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else {
    selectedIds.value.add(id)
  }
  selectedIds.value = new Set(selectedIds.value)
}

function handleSelectAll() {
  if (isAllSelected.value) {
    selectedIds.value = new Set()
  } else {
    selectedIds.value = new Set(cartList.value.map(item => item.id))
  }
}

function handleUpdateQuantity(id, quantity) {
  const item = cartList.value.find(item => item.id === id)
  if (item) {
    item.quantity = quantity
  }
}

function handleCheckout() {
  const selectedItems = cartList.value.filter(item => selectedIds.value.has(item.id))
  console.log('去结算:', selectedItems)
}

function handleDelete() {
  if (selectedIds.value.size === 0) return
  if (confirm(`确定删除选中的 ${selectedIds.value.size} 件商品吗？`)) {
    cartList.value = cartList.value.filter(item => !selectedIds.value.has(item.id))
    selectedIds.value = new Set()
    if (cartList.value.length === 0) {
      isEditing.value = false
    }
  }
}

function handleEditSpec() {
  if (selectedIds.value.size !== 1) return
  const id = Array.from(selectedIds.value)[0]
  const item = cartList.value.find(item => item.id === id)
  if (item) {
    editingItem.value = item
    showEditModal.value = true
  }
}

function handleEditConfirm(data) {
  const item = cartList.value.find(item => item.id === data.id)
  if (item) {
    item.spec = data.spec
    item.rentPeriod = data.rentPeriod
    item.quantity = data.quantity
    if (data.price !== undefined) {
      item.price = data.price
    }
  }
  showEditModal.value = false
  editingItem.value = null
}

function handleEditClose() {
  showEditModal.value = false
  editingItem.value = null
}

function handleDeleteItem(id) {
  cartList.value = cartList.value.filter(item => item.id !== id)
  selectedIds.value.delete(id)
  selectedIds.value = new Set(selectedIds.value)
  if (cartList.value.length === 0) {
    isEditing.value = false
  }
}
</script>

<template>
  <div class="cart-page">
    <CartNavBar @back="handleBack" @manage="handleManage" />
    <div class="cart-page__content">
      <template v-if="cartList.length > 0">
        <div class="cart-page__list">
          <CartItem
            v-for="item in cartList"
            :key="item.id"
            :item="item"
            :is-editing="isEditing"
            :selected="selectedIds.has(item.id)"
            @select="handleSelect"
            @update:quantity="handleUpdateQuantity"
            @delete="handleDeleteItem"
          />
        </div>
      </template>
      <template v-else>
        <p class="cart-page__empty">购物车是空的</p>
      </template>
    </div>

    <CartFooter
      v-if="cartList.length > 0"
      :is-editing="isEditing"
      :is-all-selected="isAllSelected"
      :selected-count="selectedCount"
      :selected-item-count="selectedItemCount"
      :total-price="totalPrice"
      :platform-discount="platformDiscount"
      :final-price="finalPrice"
      @select-all="handleSelectAll"
      @checkout="handleCheckout"
      @delete="handleDelete"
      @edit-spec="handleEditSpec"
    />

    <EditSpecModal
      :visible="showEditModal"
      :item="editingItem"
      @close="handleEditClose"
      @confirm="handleEditConfirm"
    />
  </div>
</template>

<style scoped>
.cart-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 72px;
}

.cart-page__content {
  min-height: calc(100vh - 44px);
}

.cart-page__list {
  padding: 12px 16px;
}

.cart-page__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 44px);
  font-size: 14px;
  color: #999999;
}
</style>
