<template>
  <v-row>
    <v-col cols="12">
      <div class="delivery-header">
        <h1 style="padding-bottom: 10px">{{ $t('deliveries') }}</h1>
        <v-btn
          link
          to="/deliveries/new"
          color="#033a71"
          style="color: #fff;"
        >
          {{ $t('createDelivery') }}
        </v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="deliveries"
        :items-per-page="10"
        :no-data-text="$t('noData')"
        :locale="locale"
        class="deliveries-table"
      >
        <template #item.status="{ item }">
          <span>
            <a :href="`/deliveries/${item.id}`" style="text-decoration: none; color: #033a71;">
              <h4>
                <v-icon style="font-size: 48px; padding-right: 10px;">{{ statusToIcon(item.status) }}</v-icon>
                {{ $t(item.status) }}
              </h4>
            </a>
          </span>
        </template>
        <template #item.startPoint="{ item }">
          <span>{{ item.route[0].name }}</span>
        </template>
        <template #item.endPoint="{ item }">
          <span>{{ item.route[item.route.length - 1].name }}</span>
        </template>
        <template #item.remove="{ item }">
          <v-btn v-if="item.status === 'preparing_to_deliver'" icon @click="deleteDeliveryAction(item.id)">
            <v-icon color="red">mdi-close-circle-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'deliveries',
  mounted() {
    this.loadDeliveriesAction()
  },
  computed: {
    ...mapState(['deliveries']),
    ...mapGetters(['locale']),
    headers() {
      return [
        {
          text: this.$t('status'),
          value: 'status'
        },
        {
          text: this.$t('parcelNumber'),
          value: 'ttn'
        },
        {
          text: this.$t('startPoint'),
          value: 'startPoint'
        },
        {
          text: this.$t('endPoint'),
          value: 'endPoint'
        },
        {
          text: this.$t('estimatedDate'),
          value: 'estimatedDeliveryDate'
        },
        {
          text: this.$t('deleteDelivery'),
          value: 'remove'
        }
      ]
    }
  },
  methods: {
    ...mapActions(['loadDeliveriesAction', 'deleteDeliveryAction']),
    statusToIcon(status) {
      return {
        preparing_to_deliver: 'mdi-package-variant-closed',
        delivering: 'mdi-truck-delivery',
        delivered: 'mdi-package-variant'
      }[status]
    }
  },
  watch: {
    locale() {
      console.log('fsd')
      this.loadDeliveriesAction()
    }
  }
}
</script>

<style lang="scss">
  .deliveries-table {
    tbody {
      tr {
        background-color: $element-bg-color !important;
        td {
          span {
            display: block;
            padding: 30px;
          }
        }
      }
    }
  }
</style>