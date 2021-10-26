<template>
  <v-row>
    <v-col cols="4">
      <h1 style="padding-bottom: 10px;">
        {{ $t('settings') }}
      </h1>
    </v-col>
    <v-col cols="4">
      <v-btn
        color="#033a71"
        style="color: #fff;"
        @click="createNewDbDumpAction"
      >{{ $t('createNewDump') }}</v-btn>
    </v-col>
    <v-col cols="4">
      <v-btn
        color="#033a71"
        style="color: #fff;"
        :disabled="loading"
        @click="updateSsl"
      >{{ $t('updateSsl') }}</v-btn>
    </v-col>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="dbDumps"
        :items-per-page="10"
        :no-data-text="$t('noData')"
        class="elevation-1"
      >
        <template #item.restore="{ item }">
          <v-btn color="success" @click="restoreDbDumpAction(item.id)">{{ $t('restore') }}</v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'settings',
  data() {
    return {
      loading: false
    }
  },
  mounted() {
    this.loadDbDumpsAction()
  },
  computed: {
    ...mapState(['dbDumps', 'storeLocale']),
    ...mapGetters(['locale']),
    headers() {
      return [
        { text: this.$t('dumpDate'), value: 'createdAt' },
        { text: this.$t('creator'), value: 'creator' },
        { text: '', value: 'restore' }
      ]
    }
  },
  methods: {
    ...mapActions(['loadDbDumpsAction', 'createNewDbDumpAction', 'restoreDbDumpAction']),
    async updateSsl() {
      this.loading = true
      await this.updateSslAction()
      this.loading = false
    }
  },
  watch: {
    locale() {
      this.loadDbDumpsAction()
    }
  }
}
</script>