<template>
  <v-row>
    <v-col cols="12">
      <div class="delivery-header">
        <h1 style="padding-bottom: 10px">{{ $t('iotSimulator') }}</h1>
        <v-spacer></v-spacer>
      </div>
  <v-card>
    <v-card-text>
        <v-tabs
          v-model="tab"
          centered
        >
          <v-tabs-slider color="blue"></v-tabs-slider>
          <v-tab
            v-for="item in items"
            :key="item"
          >
            {{ $t(item) }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item
            v-for="item in items"
            :key="item"
          >
            <v-card flat>
              <v-card-text v-if="item === 'statusUpdate'">
                <v-row>
                  <v-col cols=2>
                    <v-text-field
                      v-model="deliveryId"
                      label="Delivery ID"
                      outlined
                    />
                  </v-col>
                  <v-col cols=2>
                    <v-text-field
                      v-model="lat"
                      label="Latitude"
                      outlined
                    />
                  </v-col>
                  <v-col cols=2>
                    <v-text-field
                      v-model="lon"
                      label="Longitude"
                      outlined
                    />
                  </v-col>
                  <v-col cols=3>
                    <v-select
                      v-model="status"
                      :items="statusOptions"
                      label="Status"
                      outlined
                    />
                  </v-col>
                  <v-col cols=3>
                    <v-btn
                      @click="updateStatus"
                      color="blue"
                      dark
                    >
                      {{ $t('updateStatus') }}
                    </v-btn>
                  </v-col>
                  <v-col cols=6>
                    <span>
                      Endpoint: PUT {{ `${host}/deliveries/${deliveryId}` }}
                    </span>
                    <json-viewer
                      :value="updateData"
                      copyable
                      boxed
                    ></json-viewer>
                  </v-col>
                  <v-col cols=4>
                    <span>
                      {{ $t('city') }}
                    </span>
                    <v-autocomplete
                      v-model.trim="cityId"
                      :items="cities"
                      :label="$t('city')"
                      outlined
                      item-text="city"
                      item-value="id"
                      @change="setCity"
                    >
                    </v-autocomplete>
                    <p v-if="error" style="color: red;">
                      {{ error }}
                    </p>
                    <h4 v-if="success" style="color: green">
                      {{ $t('success') }}
                    </h4>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-text v-else>
                <v-row>
                  <v-col cols=2>
                    <v-text-field
                      v-model="deliveryId"
                      label="Delivery ID"
                      outlined
                    />
                  </v-col>
                  <v-col cols=2>
                    <v-text-field
                      v-model="containerId"
                      label="Container ID"
                      outlined
                    />
                  </v-col>
                  <v-col cols=2>
                    <v-text-field
                      v-model="lat"
                      label="Latitude"
                      outlined
                    />
                  </v-col>
                  <v-col cols=2>
                    <v-text-field
                      v-model="lon"
                      label="Longitude"
                      outlined
                    />
                  </v-col>
                  <v-col cols=2>
                    <v-select
                      v-model="damageStatus"
                      :items="damageOptions"
                      label="Status"
                      outlined
                    />
                  </v-col>
                  <v-col cols=2>
                    <v-btn
                      @click="damage"
                      color="blue"
                      dark
                    >
                      {{ $t('damage') }}
                    </v-btn>
                  </v-col>
                  <v-col cols=10>
                    <v-text-field
                      v-model="message"
                      label="Message"
                      outlined
                    />
                  </v-col>
                  <v-col cols=6>
                    <span>
                      Endpoint: POST {{ `${host}/deliveries/${deliveryId}/damage` }}
                    </span>
                    <json-viewer
                      :value="damageData"
                      copyable
                      boxed
                    ></json-viewer>
                  </v-col>
                  <v-col cols=4>
                    <span>
                      {{ $t('city') }}
                    </span>
                    <v-autocomplete
                      v-model.trim="cityId"
                      :items="cities"
                      :label="$t('city')"
                      outlined
                      item-text="city"
                      item-value="id"
                      @change="setCity"
                    >
                    </v-autocomplete>
                    <p v-if="error" style="color: red;">
                      {{ error }}
                    </p>
                    <h4 v-if="success" style="color: green">
                      {{ $t('success') }}
                    </h4>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
    </v-card-text>
  </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

const host = process.env.VUE_APP_API_URL
import citiesList from '../utils/worldcities.json'

export default {
  data() {
    return {
      deliveryId: '',
      cityId: '',
      lat: '',
      lon: '',
      containerId: '',
      message: '',
      status: '',
      damageStatus: '',
      tab: null,
      items: [
        'statusUpdate', 'damage'
      ],
      statusOptions: ['preparing_to_deliver', 'delivering', 'delivered'],
      damageOptions: ['exceeded_min_temperature', 'exceeded_max_temperature', 'exceeded_min_humidity', 'exceeded_max_humidity'],
      host: host,
      cities: citiesList,
      error: '',
      loading: false,
      success: false,
    }
  },
  computed: {
    updateData() {
      return {
        lat: this.lat,
        lon: this.lon,
        status: this.status
      }
    },
    damageData() {
      return {
        container_id: this.containerId,
        message: this.message,
        status: this.damageStatus,
        lat: this.lat,
        lon: this.lon
      }
    }
  },
  methods: {
    ...mapActions(['updateStatusIotAction', 'damageIotAction']),
    validateUpdateParams() {
      this.success = false
      if (!this.deliveryId) {
        this.error = this.$t('deliveryIdRequired')
        return false
      }
      if (!this.lat) {
        this.error = this.$t('latRequired')
        return false
      }
      if (!this.lon) {
        this.error = this.$t('lonRequired')
        return false
      }
      if (!this.status) {
        this.error = this.$t('statusRequired')
        return false
      }

      this.error = ''
      return true
    },
    validateDamageParams() {
      this.success = false
      if (!this.deliveryId) {
        this.error = this.$t('deliveryIdRequired')
        return false
      }
      if (!this.lat) {
        this.error = this.$t('latRequired')
        return false
      }
      if (!this.lon) {
        this.error = this.$t('lonRequired')
        return false
      }
      if (!this.damageStatus) {
        this.error = this.$t('statusRequired')
        return false
      }
      if (!this.containerId) {
        this.error = this.$t('containerIdRequired')
        return false
      }
      if (!this.message) {
        this.error = this.$t('messageRequired')
        return false
      }

      this.error = ''
      return true
    },
    async updateStatus() {
      if (!this.validateUpdateParams()) {
        return
      }

      try {
        this.loading = true
        this.updateStatusIotAction({
          id: this.deliveryId,
          params: this.updateData
        })
        this.success = true
      } catch (e) {
        this.error = e
      } finally {
        this.loading = false
      }
    },
    damage() {
      if (!this.validateDamageParams()) {
        return
      }

      try {
        this.loading = true
        this.damageIotAction({
          id: this.deliveryId,
          params: this.damageData
        })
        this.success = true
      } catch (e) {
        this.error = e
      } finally {
        this.loading = false
      }
    },
    setCity() {
      const city = this.cities.find(({ id }) => id === this.cityId)
      if (!city) return

      this.lat = city.lat
      this.lon = city.lng
    }
  }
}
</script>