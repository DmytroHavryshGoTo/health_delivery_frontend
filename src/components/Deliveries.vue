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
        :items="backups"
        :items-per-page="5"
        class="elevation-1"
      >
        <!-- <template v-slot:item.download="{ item }">
          <v-btn
            color="primary"
            dark
            small
            @click="downloadBackup(item.name, true)"
          >
            <v-icon>mdi-download</v-icon>
          </v-btn>
          <v-btn
            color="success"
            dark
            small
            style="margin-left: 10px"
            @click="restore(item.name)"
          >
            <v-icon>mdi-reload</v-icon>
          </v-btn>
        </template> -->
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'deliveries',
  computed: {
    headers() {
      return [
        {
          text: this.$t('status'),
          value: 'delivery_status'
        },
        {
          text: this.$t('minTemperature'),
          value: 'minTemperature'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>