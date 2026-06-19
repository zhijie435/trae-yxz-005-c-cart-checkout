# C端购物车统一结算模块

## 项目简介

本项目是基于 Vue 3 + Vite 构建的 C 端购物车统一结算模块，支持商品分组展示、多选/全选、租期编辑、数量调整、批量删除以及满减优惠计算等核心功能。

## 技术栈

- **框架**: Vue 3 (Composition API + `<script setup>`)
- **构建工具**: Vite 8.x
- **测试框架**: Vitest 4.x + @vue/test-utils
- **运行环境**: Node.js >= 18

## 目录结构

```
cart-app/
├── src/
│   ├── components/          # UI 组件
│   │   ├── CartNavBar.vue       # 顶部导航栏
│   │   ├── CartGroupHeader.vue  # 分组头部（含分组全选）
│   │   ├── CartItem.vue         # 商品卡片
│   │   ├── CartFooter.vue       # 底部结算栏
│   │   └── EditSpecModal.vue    # 租期/规格编辑弹窗
│   ├── composables/
│   │   └── useCart.js           # 购物车核心状态与业务逻辑
│   ├── __tests__/
│   │   └── useCart.spec.js      # 单元测试用例
│   ├── App.vue                  # 根组件
│   └── main.js                  # 入口文件
├── package.json
├── vite.config.js
└── vitest.config.js
```

---

## 一、本地环境部署

### 1.1 安装依赖

```bash
cd cart-app
npm install
```

### 1.2 启动开发服务器

```bash
npm run dev
```

默认启动地址：`http://localhost:5173`

### 1.3 生产构建

```bash
npm run build
```

构建产物输出目录：`dist/`

### 1.4 本地预览构建产物

```bash
npm run preview
```

---

## 二、本地购物车数据配置

### 2.1 数据位置

本地 Mock 数据定义在 [App.vue](file:///Users/wuzhijie/Documents/xiaohongshu/biaozhu/yxz-trae-projects/005-C端购物车统一结算/cart-app/src/App.vue#L10-L71) 的 `initialCartList` 变量中，通过 `useCart(initialCartList)` 注入到购物车逻辑中。

### 2.2 数据字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | Number | 是 | 商品唯一 ID，自增 |
| `name` | String | 是 | 商品名称，用于分组归类（包含关键词如 iPhone、Sony、MacBook 等会被归类为「数码产品」） |
| `image` | String | 是 | 商品图片 URL |
| `spec` | String | 是 | 商品规格描述（如颜色、尺码、版本等） |
| `rentPeriod` | String | 是 | 当前租期（如 `30天`、`7天`） |
| `price` | Number | 是 | 当前租期对应的单价（元） |
| `quantity` | Number | 是 | 租赁数量 |
| `priceMap` | Object | 否 | 各租期对应的价格表，用于租期切换时查价 |

### 2.3 商品分组规则

分组逻辑定义在 [useCart.js](file:///Users/wuzhijie/Documents/xiaohongshu/biaozhu/yxz-trae-projects/005-C端购物车统一结算/cart-app/src/composables/useCart.js#L3-L20) 的 `GROUP_CATEGORY_MAP` 和 `getCategoryByName()` 函数中：

- 商品名包含 `iPhone` / `Sony` / `MacBook` / `DJI` / `iPad` / `AirPods` / `Apple Watch` → 归类为 **「数码产品」**
- 其余商品 → 归类为 **「其他商品」**

### 2.4 默认 Mock 商品清单（6 件）

| ID | 商品名称 | 分组 | 租期 | 单价(元) | 数量 |
|----|----------|------|------|----------|------|
| 1 | Apple iPhone 15 Pro Max 256GB | 数码产品 | 30天 | 39.9 | 1 |
| 2 | Sony WH-1000XM5 无线降噪耳机 | 数码产品 | 7天 | 15.9 | 2 |
| 3 | MacBook Pro 14英寸 M3 Pro | 数码产品 | 90天 | 89.9 | 1 |
| 4 | DJI Mini 4 Pro 航拍无人机 | 数码产品 | 3天 | 49.9 | 1 |
| 5 | Nike Air Max 270 运动鞋 | 其他商品 | 7天 | 25.9 | 1 |
| 6 | 宜家 KALLAX 卡莱克 书架 | 其他商品 | 30天 | 19.9 | 2 |

### 2.5 自定义/扩展数据

如需修改或增加商品，编辑 `App.vue` 中的 `initialCartList` 数组即可。新增商品示例：

```js
{
  id: 7,
  name: 'iPad Pro 12.9英寸 M4',
  image: 'https://.../ipad.jpg',
  spec: '容量: 256GB',
  rentPeriod: '30天',
  price: 59.9,
  quantity: 1,
  priceMap: { '7天': 19.9, '30天': 59.9, '90天': 149.9 }
}
```

---

## 三、接口环境配置

### 3.1 当前状态

当前版本为 **纯前端 Mock 模式**，所有购物车数据均来自本地 `initialCartList`，不依赖任何后端接口。核心业务逻辑封装在 [useCart.js](file:///Users/wuzhijie/Documents/xiaohongshu/biaozhu/yxz-trae-projects/005-C端购物车统一结算/cart-app/src/composables/useCart.js) 中，数据层与视图层完全解耦。

### 3.2 接入真实接口的改造指南

当需要对接后端 API 时，按以下步骤改造：

#### Step 1：新增 API 请求层

创建 `src/api/cart.js`：

```js
// 环境配置（可通过 .env 注入）
const BASE_URL = import.meta.env.VITE_API_BASE || '/api'

// 获取购物车列表
export async function fetchCartList() {
  const res = await fetch(`${BASE_URL}/cart/list`)
  if (!res.ok) throw new Error('获取购物车失败')
  return res.json()
}

// 更新商品数量
export async function apiUpdateQuantity(id, quantity) {
  await fetch(`${BASE_URL}/cart/item/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  })
}

// 删除商品
export async function apiDeleteItem(id) {
  await fetch(`${BASE_URL}/cart/item/${id}`, { method: 'DELETE' })
}

// 结算下单
export async function apiCheckout(itemIds) {
  const res = await fetch(`${BASE_URL}/cart/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemIds })
  })
  return res.json()
}
```

#### Step 2：环境变量配置

创建 `.env.development` 和 `.env.production`：

```bash
# .env.development
VITE_API_BASE=http://localhost:3000/api

# .env.production
VITE_API_BASE=https://api.yourdomain.com/api
```

#### Step 3：在 useCart 中接入（示例）

```js
import { ref, computed, onMounted } from 'vue'
import { fetchCartList, apiUpdateQuantity, apiDeleteItem } from '../api/cart'

export function useCart(initialCartList = []) {
  const cartList = ref(initialCartList)
  const isLoading = ref(false)

  // 初始化时拉取远程数据
  async function loadCart() {
    isLoading.value = true
    try {
      const data = await fetchCartList()
      cartList.value = data
    } finally {
      isLoading.value = false
    }
  }

  if (initialCartList.length === 0) {
    onMounted(loadCart)
  }

  // 数量更新时同步后端（防抖处理建议）
  async function updateQuantity(id, quantity) {
    const item = cartList.value.find(i => i.id === id)
    if (!item) return
    item.quantity = quantity  // 乐观更新
    try {
      await apiUpdateQuantity(id, quantity)
    } catch (e) {
      // 回滚逻辑
    }
  }

  // ... 其余方法同理包装 API 调用
  return { /* ... */, loadCart, isLoading }
}
```

### 3.3 各环境一览

| 环境名称 | API Base URL | 用途 | 备注 |
|----------|-------------|------|------|
| 本地 Mock | 无（前端本地数据） | 开发调试、UI 走查 | 默认模式，零配置启动 |
| 开发环境 dev | `http://localhost:3000/api` | 联调后端 | 配置 `.env.development` |
| 测试环境 test | `https://test-api.yourdomain.com/api` | QA 测试 | 构建时指定 `--mode test` |
| 生产环境 prod | `https://api.yourdomain.com/api` | 正式上线 | `npm run build` 默认使用 |

---

## 四、平台优惠规则

购物车支持阶梯式满减优惠，逻辑位于 [useCart.js](file:///Users/wuzhijie/Documents/xiaohongshu/biaozhu/yxz-trae-projects/005-C端购物车统一结算/cart-app/src/composables/useCart.js#L76-L82)：

| 选中商品总价 | 平台优惠 |
|-------------|---------|
| ≥ 200 元 | 减 30 元 |
| ≥ 100 元 | 减 10 元 |
| ≥ 50 元 | 减 5 元 |
| < 50 元 | 无优惠 |

实际支付金额 = `max(0, 总价 - 优惠)`

---

## 五、验收步骤（Acceptance Checklist）

### 5.1 页面展示与数据渲染

| # | 验收项 | 操作步骤 | 预期结果 |
|---|--------|----------|----------|
| 1.1 | 页面正常加载 | 启动 `npm run dev`，访问首页 | 页面无白屏，无控制台报错 |
| 1.2 | 顶部导航栏 | 查看顶部 | 显示「购物车」标题 + 「管理」按钮 |
| 1.3 | 商品分组展示 | 查看商品列表 | iPhone/Sony/MacBook/DJI 归入「数码产品」，Nike/宜家归入「其他商品」 |
| 1.4 | 分组头部显示 | 查看每个分组 | 显示分组名称、分组全选 checkbox、选中/总数（如 3/3） |
| 1.5 | 商品卡片信息 | 抽查任意商品 | 显示图片、名称、规格、租期、单价、数量调整控件 |
| 1.6 | 底部结算栏 | 查看底部 | 显示全选 checkbox、「已选 N 件」、合计金额、优惠金额、实付金额、「去结算」按钮 |
| 1.7 | 空购物车提示 | 临时将 initialCartList 设为空数组 | 页面居中显示「购物车是空的」，底部结算栏不显示 |

### 5.2 单选 / 多选 / 全选功能

| # | 验收项 | 操作步骤 | 预期结果 |
|---|--------|----------|----------|
| 2.1 | 单个商品选中 | 点击商品前的 checkbox | checkbox 高亮，底部「已选」数 +1，合计金额增加对应金额 |
| 2.2 | 单个商品取消选中 | 再次点击已选中商品 | checkbox 取消，底部计数 -1，合计扣减 |
| 2.3 | 全选 | 点击底部全选 checkbox | 所有商品选中，全选框高亮，「已选 N 件」等于商品总数 |
| 2.4 | 取消全选 | 再次点击全选框 | 所有商品取消选中，计数归零，合计 = 0 |
| 2.5 | 部分选中时全选框状态 | 选中部分商品（如 2/4） | 底部全选框显示 **半选**（indeterminate）状态 |
| 2.6 | 分组全选 | 点击「数码产品」分组头部的全选框 | 该分组下所有商品选中，分组全选框高亮 |
| 2.7 | 分组部分选中 | 在分组内只选 1 件 | 分组全选框显示半选状态 |
| 2.8 | 分组全部选中后联动底部 | 选中两个分组的全部商品 | 底部全选框自动高亮为全选 |

### 5.3 数量调整

| # | 验收项 | 操作步骤 | 预期结果 |
|---|--------|----------|----------|
| 3.1 | 数量递增 | 选中商品后，点击「+」 | 数量 +1，合计金额实时重新计算 |
| 3.2 | 数量递减 | 点击「-」 | 数量 -1（最低为 1，不能减到 0） |
| 3.3 | 数量影响优惠档 | 增加数量使总价从 99 → 100 | 优惠从 5 元提升为 10 元，实付 = 100 - 10 = 90 |

### 5.4 删除功能（管理模式）

| # | 验收项 | 操作步骤 | 预期结果 |
|---|--------|----------|----------|
| 4.1 | 进入/退出编辑模式 | 点击顶部「管理」→「完成」 | 切换时底部按钮在「去结算」↔「删除」之间切换 |
| 4.2 | 单商品删除 | 进入编辑模式 → 选中 1 件 → 点击「删除」→ 确认 | 该商品从列表移除，选中集合同步移除该 ID |
| 4.3 | 批量删除 | 选中多件（如 2 件）→ 删除 → 确认 | 2 件商品同时消失，选中数归零 |
| 4.4 | 删除确认弹窗 | 点击删除 | 弹出「确定删除选中的 N 件商品吗？」确认框 |
| 4.5 | 删除最后一件商品 | 购物车只剩 1 件 → 删除 | 列表清空后自动退出编辑模式，显示空购物车 |
| 4.6 | 未选商品时点击删除 | 编辑模式下不选任何商品 → 点删除 | 无任何操作（不弹窗、不删除） |

### 5.5 租期 / 规格编辑

| # | 验收项 | 操作步骤 | 预期结果 |
|---|--------|----------|----------|
| 5.1 | 编辑入口 | 选中 **仅 1 件** 商品 → 底部出现「编辑租期」按钮 | 多选中时按钮不出现 |
| 5.2 | 打开弹窗 | 点击「编辑租期」 | 弹出规格编辑 Modal，预填当前商品的规格、租期、数量 |
| 5.3 | 切换租期查价 | 租期从「30天」切换到「90天」 | 单价自动根据 priceMap 更新（如 iPhone 39.9 → 99.9） |
| 5.4 | 确认保存 | 修改后点「确定」 | Modal 关闭，商品卡片的租期/规格/数量/单价全部更新，合计重算 |
| 5.5 | 取消编辑 | 点「取消」或关闭按钮 | 不做任何修改，商品信息保持原样 |

### 5.6 价格与优惠合计

| # | 验收项 | 操作步骤 | 预期结果 |
|---|--------|----------|----------|
| 6.1 | 总价计算公式 | 选中商品 A (39.9×1) + B (15.9×2) | 合计 = 39.9 + 31.8 = **71.7** |
| 6.2 | 满 50 减 5 | 总价 = 71.7 | platformDiscount = 5，finalPrice = 66.7 |
| 6.3 | 满 100 减 10 | 调整数量使总价 = 100 | platformDiscount = 10，finalPrice = 90 |
| 6.4 | 满 200 减 30 | 总价 = 200 | platformDiscount = 30，finalPrice = 170 |
| 6.5 | 不满足优惠 | 总价 = 48 | 优惠 = 0，实付 = 48 |
| 6.6 | 删除后合计刷新 | 全选后删除 1 件高价商品 | 总价、优惠、实付全部同步减少 |
| 6.7 | 未选中时全部为 0 | 不选任何商品 | 合计 = 0，优惠 = 0，实付 = 0 |
| 6.8 | 实付不为负 | 极端场景（优惠 > 总价） | finalPrice 恒 ≥ 0 |

### 5.7 编辑模式细节

| # | 验收项 | 操作步骤 | 预期结果 |
|---|--------|----------|----------|
| 7.1 | 退出编辑清空选中 | 选中若干 → 点「完成」退出编辑 | selectedIds 被清空，所有 checkbox 恢复未选 |
| 7.2 | 空购物车不显示管理 | initialCartList 为空 | 顶部「管理」按钮不显示或禁用 |
| 7.3 | 全选删除后退出编辑 | 全选 → 删除 → 确认 | 删空后 isEditing 自动变为 false |

---

## 六、自动化测试

### 6.1 运行测试

```bash
# 单次运行
npm run test

# 监听模式
npm run test:watch
```

### 6.2 测试覆盖范围

当前 [useCart.spec.js](file:///Users/wuzhijie/Documents/xiaohongshu/biaozhu/yxz-trae-projects/005-C端购物车统一结算/cart-app/src/__tests__/useCart.spec.js) 已覆盖以下 4 大测试套件、共计 **30+ 条测试用例**：

1. **购物车删除功能测试**（8 条）：单删、批量删、删后选中同步、删空自动退出编辑
2. **全选反选功能测试**（12 条）：单选、全选、分组全选、半选状态、不存在分组容错
3. **租期编辑功能测试**（9 条）：租期查价、规格更新、单选中获取、编辑模式切换
4. **租金押金合计测试**（13 条）：总价计算、三档满减、实付计算、删改后刷新、空购物车边界

验收前请确保 `npm run test` 全部通过（绿色 PASS）。

---

## 七、上线前 Checklist

- [ ] `npm run test` 全部通过
- [ ] `npm run build` 构建成功，无警告
- [ ] 各尺寸移动端（375 / 414 / 390px）UI 无错位
- [ ] 真机点击无延迟、弹窗动画流畅
- [ ] 控制台无 error / 无 warning
- [ ] 结算接口联调通过（接入后端后）
- [ ] 埋点事件上报正确（如需）
