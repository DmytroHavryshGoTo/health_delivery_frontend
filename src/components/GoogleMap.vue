<template>
  <div class="map-section">
    <v-skeleton-loader
      v-if="loading"
      v-bind="loaderOptions"
      type="card-avatar, article, actions"
    ></v-skeleton-loader>
    <template v-else>
      <gmap-map
        ref="mainMap"
        :center="startLocation"
        :zoom="6"
        map-type-id="roadmap"
        style="width: 100%; height: 100%"
        :options="{
            zoomControl: false,
            scaleControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            disableDefaultUi: false,
            mapId
          }"
      >
        <gmap-marker
          v-for="(item, key) in googleMapDeliveries"
          :key="key"
          :position="getPosition(item)"
          :clickable="true"
          :icon="getMarkers(key)"
          @click="toggleInfo(item, key)"
        ></gmap-marker>
      </gmap-map>
      <transition name="map-info-window-slide">
        <div
          class="map-info-window"
          :opened="infoOpened"
          :position="infoPosition"
          v-if="infoOpened"
        >
          <div class="city-info" v-if="selectedMarker">
            <h4 class="modal-title"><a :href="`/deliveries/${selectedMarker.id}`">#{{ selectedMarker.ttn }}</a>{{ $t('estimatedDate') }}: {{ selectedMarker.estimatedDeliveryDate }}</h4>
            <v-data-table
              :headers="itemHeaders"
              :items="selectedMarker.drugs"
              :disable-pagination="true"
              :disable-filtering="true"
              :disable-sort="true"
              :hide-default-footer="true"
              class="elevation-1"
            ></v-data-table>
            <v-btn
              color="#033a71"
              style="color: #fff;"
              @click="closeInfoWindow"
            >
              {{ $t('close') }}
            </v-btn>
          </div>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

const mapId = process.env.VUE_APP_MAP_ID

export default {
  name: 'google-map',
  data: function() {
    let mapMarker = 'data:image/png;base64,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'
    let mapMarkerActive = 'data:image/png;base64,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'
    return {
      loaderOptions: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2
      },
      loading: true,
      mapMarker,
      mapId,
      mapMarkerActive,
      startLocation: {
        lat: 49.0384,
        lng: 33.4513
      },
      selectedKey: null,
      selectedMarker: null,
      infoOpened: false
    };
  },
  mounted() {
    this.loadActiveDeliveries()
  },
  computed: {
    ...mapState(['googleMapDeliveries']),
    itemHeaders() {
      return [
        {
          text: this.$t('name'),
          value: 'name'
        },
        {
          text: this.$t('minTemperature') + ' °C',
          value: 'minTemperature'
        },
        {
          text: this.$t('maxTemperature') + ' °C',
          value: 'maxTemperature'
        },
        {
          text: this.$t('minHumidity') + ' %',
          value: 'minHumidity'
        },
        {
          text: this.$t('maxHumidity') + ' %',
          value: 'maxHumidity'
        }
      ]
    },
    deliveriesWithCoords() {
      return this.googleMapDeliveries.filter(({ lat, lon }) => lat && lon)
    }
  },
  methods: {
    ...mapActions(['loadGoogleMapDeliveriesAction']),
    async loadActiveDeliveries() {
      await this.loadGoogleMapDeliveriesAction()
      this.loading = false
    },
    getMarkers(key) {
      if (this.selectedKey === key) return this.mapMarkerActive
      return this.mapMarker
    },
    getPosition: function(marker) {
      return {
        lat: parseFloat(marker.lat),
        lng: parseFloat(marker.lon)
      };
    },
    toggleInfo: function(marker, key) {
      if (this.selectedMarker === marker) return this.closeInfoWindow()
      this.infoPosition = this.getPosition(marker)
      this.selectedMarker = marker
      this.selectedKey = key
      this.infoOpened = !this.infoOpened
    },
    closeInfoWindow: function() {
      this.infoOpened = false
      this.selectedKey = null
      this.selectedMarker = null
    }
  }
};
</script>

<style lang="scss" scoped>
  .map-section {
    padding-bottom: 50px;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  .map-info-window {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: $element-bg-color;
    padding: 15px 20px 10px;
    .modal-title {
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
    }
  }
  .map-info-window-slide-leave-active,
  .map-info-window-slide-enter-active {
    transition: 0.5s;
  }
  .map-info-window-slide-enter {
    transform: translate(0, -100%);
  }
  .map-info-window-slide-leave-to {
    transform: translate(0, -100%);
  }
  .city-info > div {
    margin-bottom: 10px;
  }
  .map-btn-close-holder {
    margin-top: 10px;
  }
</style>