
<template>
  <div class="target">
    <h1>Ziel-Komponente geladen!</h1>
    <p>Übergebene ID: <strong>{{ targetId }}</strong></p>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

// Routen-Informationen holen
const route = useRoute();

// Zugriff auf den Parameter ':id' aus dem Pfad (/target/123)
const targetId = computed(() => route.params.id)

</script>

<style scoped>

</style>