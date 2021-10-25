<template>
  <div class="card">
    <v-skeleton-loader
      v-if="loading"
      v-bind="loaderOptions"
      type="card-avatar, article, actions"
    ></v-skeleton-loader>
    <template v-else>
      <h3>{{ $t('findParcel') }}</h3>
      <v-text-field
        v-model="search"
        filled
        rounded
        dense
        :label="$t('parcelNumber')"
      >
        <template v-slot:append>
          <v-btn
            class="find-delivery"
            color="#033a71"
            :disabled="searching"
            @click="searchDelivery"
          >{{ $t('find') }}</v-btn>
        </template>
      </v-text-field>
      <SmallDeliveryList
        v-if="searchResult.length"
        :deliveries="searchResult"
      />
      <p v-if="error" style="text-align: center;">{{ error }}</p>
      <h5 style="padding-bottom: 30px;">{{ $t('lastDeliveries') }}</h5>
      <SmallDeliveryList
        :deliveries="deliveries"
      />
      <v-row style="justify-content: center;">
        <v-btn link class="seeAll" to="/deliveries">
          {{ $t('seeAll') }}
        </v-btn>
      </v-row>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import SmallDeliveryList from './SmallDeliveryList.vue'

export default {
  name: 'find-delivery',
  components: { SmallDeliveryList },
  data() {
    return {
      loaderOptions: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2
      },
      loading: true,
      search: '',
      error: '',
      searchResult: [],
      searching: false
    }
  },
  mounted() {
    this.loadLastThreeDeliveries()
  },
  computed: {
    ...mapState(['deliveries']),
    ...mapGetters(['locale'])
  },
  methods: {
    ...mapActions(['loadLastThreeDeliveriesAction', 'searchDeliveryAction']),
    async loadLastThreeDeliveries() {
      this.loading = true
      await this.loadLastThreeDeliveriesAction()
      this.loading = false
    },
    async searchDelivery() {
      try {
        this.searching = true
        this.error = ''
        this.searchResult.push(await this.searchDeliveryAction(this.search))
      } catch (e) {
        this.searchResult = []
        this.error = e.error
      } finally {
        this.searching = false
      }
    }
  },
  watch: {
    locale() {
      this.loadLastThreeDeliveries()
    }
  }
}
</script>

<style scoped lang="scss">
  .card {
    .find-delivery {
      border-radius: 20px;
      color: #fff;
    }
    .seeAll {
      margin: 20px 0;
      border-radius: 20px;
    }
  }
</style>