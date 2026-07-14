<template>
  <div class="card mb-4">

    <!-- Dialog Overlay -->
    <div v-if="showLogin" class="modal-overlay" @click.self="showLogin = false">
      <div class="modal-content">
        <h4 class="text-center">Login</h4>
        <form @submit.prevent="handleLogin">

          <div class="mb-3  p-3 border rounded">
            <label for="name" class="form-label fw-bold">Username</label>
            <input id="userName"  class="form-control   w-auto border border-3 " v-model="form.userName" type="text" required placeholder="Enter User Name">
          </div>
          <div class="mb-3  p-3 border rounded">
            <label for="password" class="form-label">Password: &nbsp; &nbsp;</label>
            <input id="password" class="form-control   w-auto border border-3 " v-model="form.password" type="password" required placeholder="Enter password"/>
          </div>
          <div class="actions">
            <button class="btn btn-primary" type="button" @click="cancel">Cancel</button>
            <button class="btn btn-primary" type="submit" :disabled="loading">
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </form>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/service/auth/AuthService.js";
import {mapActions} from 'pinia';
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";


export default {
  name: "Login",
  props: {
    openDialog: String,
  },
  setup() {
    const umsInfoStore = useUmsInfoStore();
    return {umsInfoStore};
  },
  // Define reactive state
  data() {

    return {
      showLogin: this.openDialog,
      loading: false,
      errorMessage: '',
      form: {
        userName: 'Eckhardo',
        password: 'hrubesch'
      },

    };
  },

  // Define logic and API interactions
  methods: {

    async handleLogin() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const response = await AuthService.login(this.form);
        this.umsInfo = response.data;
        console.log(" this.umsInfo::", this.umsInfo);
        this.username = response.data.username;
        this.umsInfo.path=this.umsInfoStore.path;
        this.umsInfo.invalidPath=this.umsInfoStore.invalidPath;
        await this.umsInfoStore.fillUmsInfoStore(this.umsInfo);
        if(this.umsInfoStore.invalidPath || this.umsInfoStore.path==="info" ) {
          this.$router.push({ name: 'CommunityByURL' })
        }
        else{
          this.$router.push({ name: 'SelectedCommMemb', params: { commName:this.umsInfo.path } })
        }

        // On success:
        this.showLogin = false;
      } catch (err) {
        this.errorMessage = 'Invalid credentials. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    cancel(){
      this.showLogin = false;
      this.$router.push({name: 'Home'});
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
}

.error {
  color: red;
  font-size: 0.8rem;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
</style>
