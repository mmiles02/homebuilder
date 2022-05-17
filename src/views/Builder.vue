<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col>
          <Header/>
        </v-col>
      </v-row>

      <v-row style="padding: 20px">
        <v-col align="center">
          <template>
            <v-toolbar dense>
              <v-btn-toggle
                  v-model="toggle_multiple"
                  group
              >
                <v-btn v-for="(item, index) in apartment_items" v-bind:key="index" :value=index>
                  {{ item }}
                </v-btn>
              </v-btn-toggle>
            </v-toolbar>
          </template>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <img src="../assets/fullapartment.png" style="width: 600px">
        </v-col>
      </v-row>


    </v-col>
  </v-row>
</template>

<script>
import Header from '@/components/Header.vue'
export default {
  name: 'BinderPage',

  components: {
    Header
  },

  props: {
    locked: {
      type: Boolean,
      default: true,
      required: true
    }
  },

  mounted: async function() {
    if (this.locked) {
      // this.$router.push({ name: 'home' })
    }
  },

  data() {
    return {
      show: false,
      password: '',
      apartment_items: ['Couch', 'TV', 'Coffee Table'],
      dropdown_font: [
          { text: 'Arial' },
          { text: 'Calibri' },
          { text: 'Courier' },
          { text: 'Verdana' },
        ],
        dropdown_edit: [
          { text: '100%' },
          { text: '75%' },
          { text: '50%' },
          { text: '25%' },
          { text: '0%' },
        ],
        toggle_exclusive: 2,
        toggle_multiple: [1, 2, 3],
    }
  }
}
</script>

<style lang="scss">
</style>