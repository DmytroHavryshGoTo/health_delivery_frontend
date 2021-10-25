<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2" class="sidebar">
        <div class="logo">
          <v-icon dark>mdi-hospital-box-outline</v-icon>
          <h3>HEALTH <br>DELIVERY</h3>
        </div>
        <Sidebar />
      </v-col>
      <v-col cols="10" class="main">
        <v-select
          outlined
          dense
          class="locale-select"
          v-model="locale"
          :items="['en', 'uk']"
          @change="changeLocale"
        />
        <v-row class="wrapper">
          <v-col class="header" cols="12">
            <h2>{{ $t('helloMessage') }} {{ user.firstName }}!</h2>
          </v-col>
          <template v-if="$route.name === 'Home'">
            <v-col cols="7">
              <div class="card map-container">
                <h3>{{ $t('yourDeliveries') }}</h3>
                <GoogleMap />
              </div>
            </v-col>
            <v-col cols="5">
              <FindDelivery v-if="user" />
            </v-col>
          </template>
          <router-view v-else />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { mapState, mapActions, mapMutations } from 'vuex'
  import Sidebar from '@/components/Sidebar.vue'
  import GoogleMap from '@/components/GoogleMap.vue'
  import FindDelivery from '@/components/FindDelivery.vue'

  export default Vue.extend({
    name: 'home',
    components: { Sidebar, GoogleMap, FindDelivery },
    data: () => ({
      locale: ''
    }),
    mounted() {
      this.locale = localStorage.getItem('locale') || 'en'
      this.loadUserProfileAction()
    },
    computed: {
      ...mapState(['user'])
    },
    methods: {
      ...mapActions(['loadUserProfileAction']),
      ...mapMutations(['setStoreLocale']),
      changeLocale(val: string) {
        this.setStoreLocale(val)
        this.$i18n.locale = val
        this.$vuetify.lang.current = val
        localStorage.setItem('locale', val)
      }
    }
  })
</script>

<style lang="scss">
  .card {
    .v-input__append-inner {
      button {
        margin-top: -6px;
        margin-right: -12px;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .map-container {
    height: 100%;
  }
</style>