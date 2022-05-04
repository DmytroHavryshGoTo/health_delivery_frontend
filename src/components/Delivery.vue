<template>
  <v-row>
    <v-col cols="4">
      <h1 style="padding-bottom: 20px">{{ $t('deliveries') }}: {{ delivery.name }}
        <span v-if="delivery.ad" class="small-span">
            <a :href="`/ads?search=${delivery.ad.attributes.name}`">
              ({{ delivery.ad.attributes.name }})
            </a>
        </span>
      </h1>
      <h4 style="padding-bottom: 20px">{{ $t('parcelNumber') }}: {{ delivery.ttn }}</h4>
      <h4 style="padding-bottom: 20px">{{ $t('status') }}: {{ $t(delivery.status) }}</h4>
      <DrugsList
        :drugs="delivery.drugs"
      />
    </v-col>
    <v-col cols="8" style="padding-top: 50px">
      <Route
        :delivery="delivery"
        :route="delivery.route"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DrugsList from './DrugsList.vue'
import Route from './Route.vue'

export default {
  name: 'delivery',
  components: { DrugsList, Route },
  mounted() {
    this.loadDelivery(this.$route.params.id)
  },
  computed: {
    ...mapState(['delivery'])
  },
  methods: {
    ...mapActions(['loadDelivery'])
  }
}
</script>