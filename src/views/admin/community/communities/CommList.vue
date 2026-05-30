<template>
  <div class="card">
    <div class="card-header">
      Tipp-Gemeinschaften
    </div>
    <div class="card-body">

      <ul>
        <li v-for="comm in communities" :key="comm.id">
          <h3>{{ comm.name }}</h3>
          <p>{{ comm.description }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  communities: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>

</style>