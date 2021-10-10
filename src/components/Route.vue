<template>
  <div>
    <v-row>
      <v-col style="display: flex; justify-content: flex-end;" v-if="isPreview">
        <div v-for="(station, idx) in damagedRoutes" :key="idx" class="damage-container">
          <h4>{{ station.name }}</h4>
          <template v-for="(damage, idxx) in station.damages">
            <div :key="idxx">
              <h5>{{ delivery.drugs.find(({ id }) => id === damage.drug_id).name }}</h5>
              <p>{{ damage.message }}</p>
            </div>
          </template>
        </div>
      </v-col>
      <v-col>
        <h3 style="margin-top: -28px;">{{ $t('route') }}</h3>
        <div style="display: flex;" v-if="!isPreview">
          <v-autocomplete
            v-model.trim="newStationId"
            :items="cities"
            :label="$t('newStation')"
            outlined
            item-text="city"
            item-value="id"
            append-icon="mdi-plus-circle-outline"
            @click:append="addNewStation"
            @keypress.enter="addNewStation"
          >
          </v-autocomplete>
        </div>
        <v-timeline
          align-top
          dense
          class="overflow-y-auto" style="max-height: 480px;"
        >
          <v-timeline-item
            v-for="(station, idx) in route"
            :key="idx"
            :color="getStatusColor(station)"
            small
          >
            <v-row class="pt-1">
              <v-col cols="6">
                <strong>{{ station.name }}</strong>
              </v-col>
              <v-col cols="4" v-if="idx === 0">
                <strong>{{ $t('startPoint') }}</strong>
                <div class="text-caption">
                  {{ delivery.createdAt || todayDate }}
                </div>
              </v-col>
              <v-col cols="4" v-else-if="idx === route.length - 1">
                <strong>{{ $t('endPoint') }}</strong>
                <div class="text-caption" v-if="delivery.estimatedDeliveryDate || endDate">
                  {{ delivery.estimatedDeliveryDate || endDate }}
                </div>
              </v-col>
              <v-col cols="4" v-else></v-col>
              <v-col cols="2">
                <v-btn icon @click="() => route.splice(idx, 1)" v-if="!isPreview">
                  <v-icon color="red">mdi-close-circle-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import citiesList from '../utils/worldcities.json'

export default {
  name: 'route',
  props: {
    route: { type: Array, required: true },
    isPreview: { type: Boolean, default: true },
    endDate: { type: String, default: '' },
    delivery: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      todayDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      newStationId: '',
      cities: citiesList
    }
  },
  computed: {
    damagedRoutes() {
      return this.route.filter(({ damages }) => !!damages)
    }
  },
  methods: {
    addNewStation() {
      if (!this.newStationId) return

      const city = this.cities.find(({ id }) => id === this.newStationId)
      this.route.push({
        name: city.city,
        lat: city.lat,
        lon: city.lng
      })
      this.newStationId = ''
    },
    getStatusColor(station) {
      if (station.damages) return 'red'

      if (station.passed || station.current) return '#033a71'

      return 'grey'
    }
  }
}
</script>

<style lang="scss">
  .damage-container {
    height: max-content;
    padding: 12px;
    border: 2px solid #f44336;
    border-radius: 40px;
    background-color: #fcfcfc;
  }
  .v-timeline-item__divider {
    min-height: 100px;
  }
</style>