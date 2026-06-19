import { ref, computed } from 'vue'

const GROUP_CATEGORY_MAP = {
  'iPhone': '数码产品',
  'Sony': '数码产品',
  'MacBook': '数码产品',
  'DJI': '数码产品',
  'iPad': '数码产品',
  'AirPods': '数码产品',
  'Apple Watch': '数码产品'
}

function getCategoryByName(name) {
  for (const [keyword, category] of Object.entries(GROUP_CATEGORY_MAP)) {
    if (name.includes(keyword)) {
      return category
    }
  }
  return '其他商品'
}

export function useCart(initialCartList = []) {
  const cartList = ref(initialCartList)
  const isEditing = ref(false)
  const selectedIds = ref(new Set())

  const groupedItems = computed(() => {
    const groups = {}
    cartList.value.forEach(item => {
      const category = getCategoryByName(item.name)
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(item)
    })
    return Object.entries(groups).map(([name, items]) => ({
      name,
      items,
      id: name
    }))
  })

  const groupState = computed(() => {
    const state = {}
    groupedItems.value.forEach(group => {
      const groupItemIds = group.items.map(item => item.id)
      const selectedInGroup = groupItemIds.filter(id => selectedIds.value.has(id))
      state[group.id] = {
        isAllSelected: selectedInGroup.length === groupItemIds.length && groupItemIds.length > 0,
        isPartialSelected: selectedInGroup.length > 0 && selectedInGroup.length < groupItemIds.length,
        selectedCount: selectedInGroup.length,
        totalCount: groupItemIds.length
      }
    })
    return state
  })

  const isAllSelected = computed(() => {
    return cartList.value.length > 0 && selectedIds.value.size === cartList.value.length
  })

  const selectedCount = computed(() => selectedIds.value.size)

  const selectedItems = computed(() => {
    return cartList.value.filter(item => selectedIds.value.has(item.id))
  })

  const selectedItemCount = computed(() => {
    return selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
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

  function toggleSelect(id) {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id)
    } else {
      selectedIds.value.add(id)
    }
    selectedIds.value = new Set(selectedIds.value)
  }

  function selectItem(id) {
    selectedIds.value.add(id)
    selectedIds.value = new Set(selectedIds.value)
  }

  function deselectItem(id) {
    selectedIds.value.delete(id)
    selectedIds.value = new Set(selectedIds.value)
  }

  function toggleSelectAll() {
    if (isAllSelected.value) {
      clearSelection()
    } else {
      selectAll()
    }
  }

  function selectAll() {
    selectedIds.value = new Set(cartList.value.map(item => item.id))
  }

  function clearSelection() {
    selectedIds.value = new Set()
  }

  function toggleGroupSelect(groupId) {
    const group = groupedItems.value.find(g => g.id === groupId)
    if (!group) return

    const groupItemIds = group.items.map(item => item.id)
    const state = groupState.value[groupId]

    if (state.isAllSelected) {
      groupItemIds.forEach(id => selectedIds.value.delete(id))
    } else {
      groupItemIds.forEach(id => selectedIds.value.add(id))
    }
    selectedIds.value = new Set(selectedIds.value)
  }

  function selectGroup(groupId) {
    const group = groupedItems.value.find(g => g.id === groupId)
    if (!group) return
    group.items.forEach(item => selectedIds.value.add(item.id))
    selectedIds.value = new Set(selectedIds.value)
  }

  function deselectGroup(groupId) {
    const group = groupedItems.value.find(g => g.id === groupId)
    if (!group) return
    group.items.forEach(item => selectedIds.value.delete(item.id))
    selectedIds.value = new Set(selectedIds.value)
  }

  function updateQuantity(id, quantity) {
    const item = cartList.value.find(item => item.id === id)
    if (item) {
      item.quantity = quantity
    }
  }

  function updateItemSpec(id, data) {
    const item = cartList.value.find(item => item.id === id)
    if (item) {
      item.spec = data.spec
      item.rentPeriod = data.rentPeriod
      item.quantity = data.quantity
      if (data.price !== undefined) {
        item.price = data.price
      }
    }
  }

  function deleteItem(id) {
    cartList.value = cartList.value.filter(item => item.id !== id)
    selectedIds.value.delete(id)
    selectedIds.value = new Set(selectedIds.value)
    if (cartList.value.length === 0) {
      isEditing.value = false
    }
  }

  function deleteSelectedItems() {
    if (selectedIds.value.size === 0) return
    cartList.value = cartList.value.filter(item => !selectedIds.value.has(item.id))
    clearSelection()
    if (cartList.value.length === 0) {
      isEditing.value = false
    }
  }

  function getSelectedSingleItem() {
    if (selectedIds.value.size !== 1) return null
    const id = Array.from(selectedIds.value)[0]
    return cartList.value.find(item => item.id === id) || null
  }

  function enterEditMode() {
    isEditing.value = true
  }

  function exitEditMode() {
    isEditing.value = false
    clearSelection()
  }

  function toggleEditMode() {
    if (isEditing.value) {
      exitEditMode()
    } else {
      enterEditMode()
    }
  }

  function getPriceForPeriod(item, period) {
    if (!item.priceMap) return item.price
    return item.priceMap[period] ?? item.price
  }

  function addItem(item) {
    const maxId = cartList.value.length > 0
      ? Math.max(...cartList.value.map(i => i.id))
      : 0
    cartList.value.push({
      ...item,
      id: maxId + 1
    })
  }

  return {
    cartList,
    isEditing,
    selectedIds,
    groupedItems,
    groupState,
    isAllSelected,
    selectedCount,
    selectedItems,
    selectedItemCount,
    totalPrice,
    platformDiscount,
    finalPrice,
    toggleSelect,
    selectItem,
    deselectItem,
    toggleSelectAll,
    selectAll,
    clearSelection,
    toggleGroupSelect,
    selectGroup,
    deselectGroup,
    updateQuantity,
    updateItemSpec,
    deleteItem,
    deleteSelectedItems,
    getSelectedSingleItem,
    enterEditMode,
    exitEditMode,
    toggleEditMode,
    getPriceForPeriod,
    addItem
  }
}
