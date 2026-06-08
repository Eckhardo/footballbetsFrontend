<!-- App.vue -->
<script setup>
import {ref} from 'vue'
import BaseList from './BaseList.vue'

// Dataset A: Users
const users = ref([
  { id: 101, name: 'Alice Smith', role: 'Admin' },
  { id: 102, name: 'Bob Jones', role: 'Editor' }
])

// Dataset B: Products
const products = ref([
  { id: 1, title: 'Wireless Mouse', price: '$29.99', xy:'banane', zz: 'orange' },
  { id: 2, title: 'Mechanical Keyboard', price: '$89.99', xy:'banane', zz: 'orange' }
])

// Business Logic Methods
const handleUserClick = (user) => console.log('Selected user:', user.name)
const handleProductDelete = (id) => {
  products.value = products.value.filter(p => p.id !== id)
}
</script>

<template>
  <div class="app-container">
    <!-- Context 1: Reusing for Users -->
    <h2>Team Members</h2>
    <BaseList
        :items="users"
        @item-click="handleUserClick"
     >
      <!-- Custom Template for Users utilizing Scoped Slots -->
      <template #default="{ item }">
        <span><strong>{{ item.name }}</strong> — {{ item.role }}</span>
      </template>
    </BaseList>

    <!-- Context 2: Reusing for Products -->
    <h2>Inventory</h2>
    <BaseList
        :items="products"
        @item-delete="handleProductDelete"
    >
      <!-- Custom Template for Products utilizing Scoped Slots -->
      <template #default="{ item }">
        <div class="product-info">
          <span>{{ item.title }}&nbsp;</span>
          <span class="price-tag">{{ item.price }}</span>
          <span>{{ item.xy }}</span>
          <span>{{ item.zz }}</span>
        </div>
      </template>
    </BaseList>
  </div>
</template>
