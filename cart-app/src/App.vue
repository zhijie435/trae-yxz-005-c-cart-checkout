<script setup>
import { ref, computed } from 'vue'
import CartNavBar from './components/CartNavBar.vue'
import CartGroupHeader from './components/CartGroupHeader.vue'
import CartItem from './components/CartItem.vue'
import CartFooter from './components/CartFooter.vue'
import EditSpecModal from './components/EditSpecModal.vue'
import { useCart } from './composables/useCart'

const initialCartList = [
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
  },
  {
    id: 5,
    name: 'Nike Air Max 270 运动鞋 黑白配色',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Nike%20Air%20Max%20270%20sneakers%20black%20white%20product%20photo&image_size=square',
    spec: '尺码: 42',
    rentPeriod: '7天',
    price: 25.9,
    quantity: 1,
    priceMap: { '1天': 5.9, '3天': 12.9, '7天': 25.9, '15天': 45.9, '30天': 79.9, '90天': 199.9, '180天': 349.9, '365天': 599.9 }
  },
  {
    id: 6,
    name: '宜家 KALLAX 卡莱克 书架 白色',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=IKEA%20KALLAX%20white%20bookshelf%20product%20photo&image_size=square',
    spec: '尺寸: 77x147cm',
    rentPeriod: '30天',
    price: 19.9,
    quantity: 2,
    priceMap: { '1天': 3.9, '3天': 8.9, '7天': 14.9, '15天': 19.9, '30天': 19.9, '90天': 49.9, '180天': 89.9, '365天': 149.9 }
  }
]

const {
  cartList,
  isEditing,
  selectedIds,
  groupedItems,
  groupState,
  isAllSelected,
  selectedCount,
  selectedItemCount,
  totalPrice,
  platformDiscount,
  finalPrice,
  toggleSelect,
  toggleSelectAll,
  toggleGroupSelect,
  updateQuantity,
  deleteItem,
  deleteSelectedItems,
  getSelectedSingleItem,
  updateItemSpec,
  enterEditMode,
  exitEditMode
} = useCart(initialCartList)

const showEditModal = ref(false)

function handleBack() {
  console.log('返回')
}

function handleManage(editing) {
  if (editing) {
    enterEditMode()
  } else {
    exitEditMode()
  }
}

function handleSelect(id) {
  toggleSelect(id)
}

function handleSelectAll() {
  toggleSelectAll()
}

function handleGroupSelect(groupId) {
  toggleGroupSelect(groupId)
}

function handleUpdateQuantity(id, quantity) {
  updateQuantity(id, quantity)
}

function handleCheckout() {
  const selectedItems = cartList.value.filter(item => selectedIds.value.has(item.id))
  console.log('去结算:', selectedItems)
}

function handleDelete() {
  if (selectedCount.value === 0) return
  if (confirm(`确定删除选中的 ${selectedCount.value} 件商品吗？`)) {
    deleteSelectedItems()
  }
}

function handleEditSpec() {
  const item = getSelectedSingleItem()
  if (item) {
    showEditModal.value = true
  }
}

function handleEditConfirm(data) {
  updateItemSpec(data.id, data)
  showEditModal.value = false
}

function handleEditClose() {
  showEditModal.value = false
}

function handleDeleteItem(id) {
  deleteItem(id)
}

const editingItem = computed(() => getSelectedSingleItem())
</script>

<template>
  <div class="cart-page">
    <CartNavBar :is-editing="isEditing" @back="handleBack" @manage="handleManage" />
    <div class="cart-page__content">
      <template v-if="cartList.length > 0">
        <div class="cart-page__groups">
          <div
            v-for="group in groupedItems"
            :key="group.id"
            class="cart-page__group"
          >
            <CartGroupHeader
              :group-name="group.name"
              :is-editing="isEditing"
              :is-all-selected="groupState[group.id]?.isAllSelected ?? false"
              :is-partial-selected="groupState[group.id]?.isPartialSelected ?? false"
              :selected-count="groupState[group.id]?.selectedCount ?? 0"
              :total-count="groupState[group.id]?.totalCount ?? 0"
              @select="handleGroupSelect(group.id)"
            />
            <div class="cart-page__list">
              <CartItem
                v-for="item in group.items"
                :key="item.id"
                :item="item"
                :is-editing="isEditing"
                :selected="selectedIds.has(item.id)"
                @select="handleSelect"
                @update:quantity="handleUpdateQuantity"
                @delete="handleDeleteItem"
              />
            </div>
          </div>
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

.cart-page__groups {
  padding-top: 4px;
}

.cart-page__group {
  margin-bottom: 8px;
}

.cart-page__list {
  padding: 0 16px 4px;
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
