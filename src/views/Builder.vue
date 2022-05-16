<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col>
          <Header/>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field
            id="password-field"
            autofocus
            outlined
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
            v-model="password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'BinderPage',

  data() {
    return {
      show: false,
      password: ''
    }
  }
}
</script>

<style lang="scss">
</style>