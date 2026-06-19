import { describe, it, expect, beforeEach } from 'vitest'
import { useCart } from '../composables/useCart'

const createMockCartList = () => [
  {
    id: 1,
    name: 'Apple iPhone 15 Pro Max 256GB 原色钛金属',
    image: 'test.jpg',
    spec: '颜色: 原色钛金属',
    rentPeriod: '30天',
    price: 39.9,
    quantity: 1,
    priceMap: { '1天': 5.9, '3天': 14.9, '7天': 24.9, '15天': 34.9, '30天': 39.9, '90天': 99.9, '180天': 179.9, '365天': 329.9 }
  },
  {
    id: 2,
    name: 'Sony WH-1000XM5 无线降噪头戴耳机 黑色',
    image: 'test.jpg',
    spec: '颜色: 黑色',
    rentPeriod: '7天',
    price: 15.9,
    quantity: 2,
    priceMap: { '1天': 3.9, '3天': 9.9, '7天': 15.9, '15天': 24.9, '30天': 39.9, '90天': 89.9, '180天': 159.9, '365天': 279.9 }
  },
  {
    id: 3,
    name: 'MacBook Pro 14英寸 M3 Pro 18GB 512GB 深空灰色',
    image: 'test.jpg',
    spec: '尺寸: 14英寸',
    rentPeriod: '90天',
    price: 89.9,
    quantity: 1,
    priceMap: { '1天': 9.9, '3天': 19.9, '7天': 39.9, '15天': 59.9, '30天': 79.9, '90天': 89.9, '180天': 159.9, '365天': 279.9 }
  },
  {
    id: 4,
    name: 'Nike Air Max 270 运动鞋 黑白配色',
    image: 'test.jpg',
    spec: '尺码: 42',
    rentPeriod: '7天',
    price: 25.9,
    quantity: 1,
    priceMap: { '1天': 5.9, '3天': 12.9, '7天': 25.9, '15天': 45.9, '30天': 79.9, '90天': 199.9, '180天': 349.9, '365天': 599.9 }
  }
]

describe('购物车删除功能测试', () => {
  let cart

  beforeEach(() => {
    cart = useCart(createMockCartList())
  })

  it('删除单个商品 - deleteItem', () => {
    expect(cart.cartList.value.length).toBe(4)
    cart.deleteItem(1)
    expect(cart.cartList.value.length).toBe(3)
    expect(cart.cartList.value.find(item => item.id === 1)).toBeUndefined()
    expect(cart.cartList.value.find(item => item.id === 2)).toBeDefined()
  })

  it('删除商品后同步更新选中状态', () => {
    cart.selectItem(1)
    cart.selectItem(2)
    expect(cart.selectedCount.value).toBe(2)
    cart.deleteItem(1)
    expect(cart.selectedCount.value).toBe(1)
    expect(cart.selectedIds.value.has(1)).toBe(false)
    expect(cart.selectedIds.value.has(2)).toBe(true)
  })

  it('删除最后一个商品后自动退出编辑模式', () => {
    cart = useCart([createMockCartList()[0]])
    cart.enterEditMode()
    expect(cart.isEditing.value).toBe(true)
    cart.deleteItem(1)
    expect(cart.cartList.value.length).toBe(0)
    expect(cart.isEditing.value).toBe(false)
  })

  it('删除非最后一个商品不影响编辑模式', () => {
    cart.enterEditMode()
    cart.deleteItem(1)
    expect(cart.isEditing.value).toBe(true)
    expect(cart.cartList.value.length).toBe(3)
  })

  it('批量删除选中商品 - deleteSelectedItems', () => {
    cart.selectItem(1)
    cart.selectItem(3)
    expect(cart.selectedCount.value).toBe(2)
    cart.deleteSelectedItems()
    expect(cart.cartList.value.length).toBe(2)
    expect(cart.cartList.value.find(i => i.id === 1)).toBeUndefined()
    expect(cart.cartList.value.find(i => i.id === 3)).toBeUndefined()
    expect(cart.cartList.value.find(i => i.id === 2)).toBeDefined()
    expect(cart.cartList.value.find(i => i.id === 4)).toBeDefined()
  })

  it('批量删除后清空选中状态', () => {
    cart.selectItem(1)
    cart.selectItem(2)
    cart.deleteSelectedItems()
    expect(cart.selectedIds.value.size).toBe(0)
    expect(cart.selectedCount.value).toBe(0)
  })

  it('批量删除所有商品后退出编辑模式', () => {
    cart.enterEditMode()
    cart.selectAll()
    cart.deleteSelectedItems()
    expect(cart.cartList.value.length).toBe(0)
    expect(cart.isEditing.value).toBe(false)
  })

  it('没有选中商品时调用deleteSelectedItems不执行操作', () => {
    const len = cart.cartList.value.length
    cart.deleteSelectedItems()
    expect(cart.cartList.value.length).toBe(len)
  })
})

describe('购物车全选反选功能测试', () => {
  let cart

  beforeEach(() => {
    cart = useCart(createMockCartList())
  })

  it('初始状态没有商品被选中', () => {
    expect(cart.selectedIds.value.size).toBe(0)
    expect(cart.selectedCount.value).toBe(0)
    expect(cart.isAllSelected.value).toBe(false)
  })

  it('单选商品 - toggleSelect', () => {
    cart.toggleSelect(1)
    expect(cart.selectedIds.value.has(1)).toBe(true)
    expect(cart.selectedCount.value).toBe(1)
    cart.toggleSelect(1)
    expect(cart.selectedIds.value.has(1)).toBe(false)
    expect(cart.selectedCount.value).toBe(0)
  })

  it('显式选中商品 - selectItem', () => {
    cart.selectItem(1)
    cart.selectItem(1)
    expect(cart.selectedIds.value.has(1)).toBe(true)
    expect(cart.selectedCount.value).toBe(1)
  })

  it('显式取消选中商品 - deselectItem', () => {
    cart.selectItem(1)
    cart.deselectItem(1)
    cart.deselectItem(1)
    expect(cart.selectedIds.value.has(1)).toBe(false)
    expect(cart.selectedCount.value).toBe(0)
  })

  it('全选商品 - selectAll', () => {
    cart.selectAll()
    expect(cart.isAllSelected.value).toBe(true)
    expect(cart.selectedCount.value).toBe(4)
    for (let i = 1; i <= 4; i++) {
      expect(cart.selectedIds.value.has(i)).toBe(true)
    }
  })

  it('清空选中 - clearSelection', () => {
    cart.selectAll()
    cart.clearSelection()
    expect(cart.selectedIds.value.size).toBe(0)
    expect(cart.selectedCount.value).toBe(0)
    expect(cart.isAllSelected.value).toBe(false)
  })

  it('切换全选反选 - toggleSelectAll', () => {
    expect(cart.isAllSelected.value).toBe(false)
    cart.toggleSelectAll()
    expect(cart.isAllSelected.value).toBe(true)
    expect(cart.selectedCount.value).toBe(4)
    cart.toggleSelectAll()
    expect(cart.isAllSelected.value).toBe(false)
    expect(cart.selectedCount.value).toBe(0)
  })

  it('分组全选 - toggleGroupSelect', () => {
    const digitalGroup = cart.groupedItems.value.find(g => g.name === '数码产品')
    expect(digitalGroup).toBeDefined()
    cart.toggleGroupSelect(digitalGroup.id)
    const state = cart.groupState.value[digitalGroup.id]
    expect(state.isAllSelected).toBe(true)
    expect(state.selectedCount).toBe(state.totalCount)
  })

  it('分组全选后再切换取消分组选中', () => {
    const digitalGroup = cart.groupedItems.value.find(g => g.name === '数码产品')
    cart.toggleGroupSelect(digitalGroup.id)
    cart.toggleGroupSelect(digitalGroup.id)
    const state = cart.groupState.value[digitalGroup.id]
    expect(state.isAllSelected).toBe(false)
    expect(state.selectedCount).toBe(0)
  })

  it('部分选中时分组状态正确', () => {
    cart.selectItem(1)
    const digitalGroup = cart.groupedItems.value.find(g => g.name === '数码产品')
    const state = cart.groupState.value[digitalGroup.id]
    expect(state.isAllSelected).toBe(false)
    expect(state.isPartialSelected).toBe(true)
  })

  it('显式分组全选 - selectGroup', () => {
    const digitalGroup = cart.groupedItems.value.find(g => g.name === '数码产品')
    cart.selectGroup(digitalGroup.id)
    const state = cart.groupState.value[digitalGroup.id]
    expect(state.isAllSelected).toBe(true)
  })

  it('显式分组取消选中 - deselectGroup', () => {
    const digitalGroup = cart.groupedItems.value.find(g => g.name === '数码产品')
    cart.selectGroup(digitalGroup.id)
    cart.deselectGroup(digitalGroup.id)
    const state = cart.groupState.value[digitalGroup.id]
    expect(state.selectedCount).toBe(0)
  })

  it('选中不存在的分组不报错', () => {
    cart.toggleGroupSelect('non-existent')
    cart.selectGroup('non-existent')
    cart.deselectGroup('non-existent')
    expect(cart.selectedCount.value).toBe(0)
  })
})

describe('购物车租期编辑功能测试', () => {
  let cart

  beforeEach(() => {
    cart = useCart(createMockCartList())
  })

  it('根据租期获取价格 - getPriceForPeriod', () => {
    const item = cart.cartList.value[0]
    expect(cart.getPriceForPeriod(item, '1天')).toBe(5.9)
    expect(cart.getPriceForPeriod(item, '7天')).toBe(24.9)
    expect(cart.getPriceForPeriod(item, '30天')).toBe(39.9)
    expect(cart.getPriceForPeriod(item, '365天')).toBe(329.9)
  })

  it('租期不存在时使用默认价格', () => {
    const item = cart.cartList.value[0]
    expect(cart.getPriceForPeriod(item, '999天')).toBe(item.price)
  })

  it('商品没有priceMap时返回默认价格', () => {
    const simpleItem = { id: 100, name: 'Test', price: 99.9 }
    expect(cart.getPriceForPeriod(simpleItem, '7天')).toBe(99.9)
  })

  it('更新商品规格 - updateItemSpec 更新租期和价格', () => {
    cart.selectItem(1)
    const item = cart.cartList.value[0]
    cart.updateItemSpec(1, {
      spec: '颜色: 深空黑色',
      rentPeriod: '7天',
      quantity: 2,
      price: 24.9
    })
    expect(item.spec).toBe('颜色: 深空黑色')
    expect(item.rentPeriod).toBe('7天')
    expect(item.quantity).toBe(2)
    expect(item.price).toBe(24.9)
  })

  it('updateItemSpec 不传入price时不修改价格', () => {
    const item = cart.cartList.value[0]
    const originalPrice = item.price
    cart.updateItemSpec(1, {
      spec: '新规格',
      rentPeriod: '15天',
      quantity: 3
    })
    expect(item.price).toBe(originalPrice)
  })

  it('updateItemSpec 更新不存在的商品不报错', () => {
    cart.updateItemSpec(999, {
      spec: 'test',
      rentPeriod: '7天',
      quantity: 1
    })
    expect(cart.cartList.value.length).toBe(4)
  })

  it('获取单个选中商品 - getSelectedSingleItem', () => {
    cart.selectItem(2)
    const selected = cart.getSelectedSingleItem()
    expect(selected).not.toBeNull()
    expect(selected.id).toBe(2)
  })

  it('没有选中或选中多个时getSelectedSingleItem返回null', () => {
    expect(cart.getSelectedSingleItem()).toBeNull()
    cart.selectItem(1)
    cart.selectItem(2)
    expect(cart.getSelectedSingleItem()).toBeNull()
  })

  it('编辑模式切换 - toggleEditMode', () => {
    expect(cart.isEditing.value).toBe(false)
    cart.toggleEditMode()
    expect(cart.isEditing.value).toBe(true)
    cart.toggleEditMode()
    expect(cart.isEditing.value).toBe(false)
  })

  it('退出编辑模式时清空选中', () => {
    cart.selectItem(1)
    cart.enterEditMode()
    cart.exitEditMode()
    expect(cart.isEditing.value).toBe(false)
    expect(cart.selectedCount.value).toBe(0)
  })
})

describe('购物车租金押金合计功能测试', () => {
  let cart

  beforeEach(() => {
    cart = useCart(createMockCartList())
  })

  it('selectedItems 只返回选中的商品', () => {
    cart.selectItem(1)
    cart.selectItem(3)
    expect(cart.selectedItems.value.length).toBe(2)
    expect(cart.selectedItems.value.map(i => i.id)).toEqual([1, 3])
  })

  it('selectedItemCount 计算选中商品总数量（含quantity）', () => {
    cart.selectItem(1)
    cart.selectItem(2)
    expect(cart.selectedItemCount.value).toBe(3)
  })

  it('totalPrice 计算选中商品总价 = 单价 × 数量', () => {
    cart.selectItem(1)
    cart.selectItem(2)
    const expected = 39.9 * 1 + 15.9 * 2
    expect(cart.totalPrice.value).toBeCloseTo(expected, 5)
  })

  it('全选时总价计算正确', () => {
    cart.selectAll()
    const expected = 39.9 * 1 + 15.9 * 2 + 89.9 * 1 + 25.9 * 1
    expect(cart.totalPrice.value).toBeCloseTo(expected, 5)
  })

  it('未选中商品时总价为0', () => {
    expect(cart.totalPrice.value).toBe(0)
    expect(cart.selectedItemCount.value).toBe(0)
  })

  it('platformDiscount - 满50减5', () => {
    cart = useCart([
      { id: 1, name: 'Test', price: 25, quantity: 2 }
    ])
    cart.selectItem(1)
    expect(cart.totalPrice.value).toBe(50)
    expect(cart.platformDiscount.value).toBe(5)
  })

  it('platformDiscount - 满100减10', () => {
    cart = useCart([
      { id: 1, name: 'Test', price: 50, quantity: 2 }
    ])
    cart.selectItem(1)
    expect(cart.totalPrice.value).toBe(100)
    expect(cart.platformDiscount.value).toBe(10)
  })

  it('platformDiscount - 满200减30', () => {
    cart = useCart([
      { id: 1, name: 'Test', price: 100, quantity: 2 }
    ])
    cart.selectItem(1)
    expect(cart.totalPrice.value).toBe(200)
    expect(cart.platformDiscount.value).toBe(30)
  })

  it('platformDiscount - 不满50无优惠', () => {
    cart = useCart([
      { id: 1, name: 'Test', price: 24, quantity: 2 }
    ])
    cart.selectItem(1)
    expect(cart.totalPrice.value).toBe(48)
    expect(cart.platformDiscount.value).toBe(0)
  })

  it('finalPrice - 实际支付 = 总价 - 优惠', () => {
    cart = useCart([
      { id: 1, name: 'Test', price: 60, quantity: 2 }
    ])
    cart.selectItem(1)
    expect(cart.totalPrice.value).toBe(120)
    expect(cart.platformDiscount.value).toBe(10)
    expect(cart.finalPrice.value).toBe(110)
  })

  it('finalPrice - 不会出现负数', () => {
    cart = useCart([
      { id: 1, name: 'Test', price: 1, quantity: 1 }
    ])
    cart.selectItem(1)
    expect(cart.finalPrice.value).toBe(1)
  })

  it('修改数量后总价重新计算', () => {
    cart.selectItem(1)
    const priceBefore = cart.totalPrice.value
    cart.updateQuantity(1, 3)
    expect(cart.totalPrice.value).toBeCloseTo(priceBefore * 3, 5)
  })

  it('修改租期和价格后总价重新计算', () => {
    cart.selectItem(1)
    const priceBefore = cart.totalPrice.value
    cart.updateItemSpec(1, {
      spec: 'test',
      rentPeriod: '90天',
      quantity: 1,
      price: 99.9
    })
    expect(cart.totalPrice.value).toBe(99.9)
    expect(cart.totalPrice.value).not.toBe(priceBefore)
  })

  it('删除商品后合计更新', () => {
    cart.selectAll()
    const priceBefore = cart.totalPrice.value
    cart.deleteItem(1)
    expect(cart.totalPrice.value).toBeLessThan(priceBefore)
  })

  it('空购物车时价格计算正确', () => {
    cart = useCart([])
    expect(cart.totalPrice.value).toBe(0)
    expect(cart.platformDiscount.value).toBe(0)
    expect(cart.finalPrice.value).toBe(0)
    expect(cart.selectedItemCount.value).toBe(0)
    expect(cart.isAllSelected.value).toBe(false)
  })
})
