<template>
  <div>
    <div class="col-md-9 ">
      <div class="card">
        <div class="card-body" style="background-color:#89b4e6" >

          <PickList v-model="myCompTeams" dataKey="id" breakpoint="1000px" listStyle="height:700px" :pt="{
                       sourceControls: { style: 'display: none' },
                       targetControls: { style: 'display: none' },
                         transferControls: { style: 'background-color:#89b4e6; padding:10px; ' },
                       sourceListContainer: { style: 'background-color: white' },
                       targetListContainer: { style: 'background-color:white ' },

          }"
          >
            <template #sourceheader><b  style=" padding-left:10px;">Verfügbar:</b></template>
            <template #targetheader><b style=" padding-left:10px;" >Ausgewählt:</b></template>
            <template #item="slotProps">
              <div class=" p-1 align-items-center gap-3">

                  <span style=" padding-left:10px;" class="font-bold">{{ slotProps.item.teamAcronym }}</span>

              </div>
            </template>
          </PickList>
        </div>
        <form @submit.prevent="handleSubmit">
          <button type="submit" class="btn btn-primary">
            Speichern
          </button>
        </form>
      </div>

    </div>

  </div>
</template>


<script>
import PickList from 'primevue/picklist';

export default {
  name: "CompTeamForm",
  components: {
    PickList
  },

  emits: ['update-compTeams'],
  props: {
    compTeams: {
      type: Array,
      required: true,
      default: () => []
    },

  },

  watch: {
    compTeams: {
      handler(newItems) {
        if (newItems) {
          console.log("Child watch compTeams");
          this.myCompTeams = newItems;
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      myCompTeams: []
    }
  },
  methods: {
    handleSubmit(event) {
      console.log('Items moved to target:', JSON.stringify(event.items));
      console.log("selected to model]::", JSON.stringify(this.myCompTeams[1]));
      this.$emit('update-compTeams', {compTeams: this.myCompTeams});
    }
  },

}
</script>

<style scoped>
/* In your component's <style> block or global CSS */
.p-picklist-source-controls {
  display: none !important;
}

</style>