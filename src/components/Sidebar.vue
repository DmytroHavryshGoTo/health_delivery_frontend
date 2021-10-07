<template>
  <v-list dense color="#033a71">
    <v-list-item link :to="'/'">
      <v-list-item-icon>
        <v-icon>mdi-format-list-bulleted</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ $t('dashboard') }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item link :to="'/deliveries'">
      <v-list-item-icon>
        <v-icon>mdi-package-variant-closed</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ $t('deliveries') }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item link :to="'/users'" v-if="isAdmin">
      <v-list-item-icon>
        <v-icon>mdi-account</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ $t('users') }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item @click="exit">
      <v-list-item-icon>
        <v-icon>mdi-exit-run</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ $t('exit') }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'sidebar',
  computed: {
    ...mapGetters(['isAdmin'])
  },
  methods: {
    exit() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
})
</script>

<style lang="scss">
  .sidebar {
    .v-list-item {
      color: #fff !important;
    }
  }
</style>