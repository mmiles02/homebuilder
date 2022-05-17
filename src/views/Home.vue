<template>
  <v-row class="standard-text">
    <v-col align="center">
      <v-row>
        <v-col>
          <Header/>
        </v-col>
      </v-row>

      <v-row class="page-padding">
        <v-col>
          <v-row>
            <v-col>
              Sign in to get started.
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                id="username-field"
                placeholder="Username"
                autofocus
                outlined
                :type="'text'"
                v-model="username"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                id="password-field"
                placeholder="Password"
                outlined
                :type="'password'"
                v-model="password"
                v-on:keyup.enter="checkPassword"
              ></v-text-field>
              <div style="color: red" v-if="error">
                Username or password is incorrect.
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-btn x-large style="background-color: #8597C1; color: white" @click="checkPassword">
                Submit
              </v-btn>
            </v-col>
          </v-row>

        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import Header from '@/components/Header.vue'
export default {
  name: 'HomePage',

  components: {
    Header
  },

  data() {
    return {
      error: false,
      username: '',
      password: ''
    }
  },

  methods: {
    checkPassword() {
      this.error = false
      if (this.hash(this.username) == 'e5ee640a' && this.hash(this.password) == 'b0e181c6') {
        this.$router.push({ name: 'about', params: { locked: false } })
      }
      else {
        this.error = true
      }
    },

    hash(b) {
      for (var a = 0, c = b.length; c--;) {
        a += b.charCodeAt(c)
        a += a << 10
        a ^= a >> 6
        a += a << 3
        a ^= a >> 11
      }
      return ((a + (a << 15) & 4294967295) >>> 0).toString(16)
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Quicksand&display=swap');
.page-padding {
  padding-top: 50px;
  max-width: 500px;
}
.standard-text {
  font-family: 'Quicksand', sans-serif;
}
</style>