
<template>
  <!-- Global Error Message -->
  <div
      v-if="showAlert"
      class="alert alert-danger fade show"
      role="alert"
  >
    <strong>{{ errorMessage }}</strong>
    <p><strong> {{ errorDetails }}</strong></p>
    <p><strong> {{ message }}</strong></p>
  </div>


</template>
<script>
export default {
  name: "ShowError",
  props: {
    showAlert: {
      type: Boolean,
    },
    message:String,
    errorMessage:String,
    errorDetails:String
  },
}
</script>

<style scoped>

</style>