<template>
  <v-row>
    <v-col cols="12">
      <div class="delivery-header">
        <h1 style="padding-bottom: 10px">{{ $t('ads') }}</h1>
        <v-spacer></v-spacer>
        <v-text-field
          :label="$t('search')"
          :append-outer-icon="'mdi-magnify'"
          outlined
          dense
          clearable
          hide-details
          width="200px"
          v-model="search"
          @click:append-outer="loadAds"
          @click:clear="clearSearch"
        />
        <v-spacer></v-spacer>
        <v-btn
          v-if="needHelp"
          @click="dialog = true"
          color="#033a71"
          style="color: #fff;"
        >
          {{ $t('createAd') }}
        </v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="ads"
        :items-per-page="10"
        :no-data-text="$t('noData')"
        :locale="locale"
        :item-class="itemRowBackground"
        class="deliveries-table"
      >
        <template #item.info="{ item }">
          <span>
            {{ item.user.firstName }} {{ item.user.lastName }}
            <br>
            {{ item.user.phoneNumber }}
          </span>
        </template>
        <template #item.status="{ item }">
          <v-btn icon>
            <v-icon :color="statusToIcon(item.status).color">{{ statusToIcon(item.status).icon }}</v-icon>
          </v-btn>
        </template>
        <template #item.action="{ item }">
          <v-btn
            v-if="item.user.id === user.id && item.status != 'completed'"
            @click="completeAd(item.id)"
            icon
          >
            <v-icon color="green">mdi-check</v-icon>
          </v-btn>
          <v-btn
            v-if="item.user.id !== user.id && item.status != 'completed'"
            @click="$router.push(`/deliveries/new?ad_id=${item.id}`)"
            icon
          >
            <v-icon color="green">mdi-arrow-right-bold</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
    <v-dialog
      v-model="dialog"
      @click:outside="closeDialog"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ $t('createAd') }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="form.name"
            @input="$v.form.name.$touch"
            :label="$t('adName')"
            :class="{ clrError: $v.form.name.$error }"
            :error-messages="errorMessage($v.form.name)"
            outlined
          />
          <v-text-field
            v-model="form.address"
            @input="$v.form.address.$touch"
            :label="$t('address')"
            :class="{ clrError: $v.form.address.$error }"
            :error-messages="errorMessage($v.form.address)"
            outlined
          />
          <v-textarea
            v-model="form.description"
            @input="$v.form.description.$touch"
            :label="$t('description')"
            :class="{ clrError: $v.form.description.$error }"
            :error-messages="errorMessage($v.form.description)"
            outlined
          />
          <p>
            {{ $t('publishPolicy') }}
          </p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="closeDialog"
          >
            {{ $t('cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="createAd"
          >
            {{ $t('create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'


export default {
  mounted() {
    this.search = this.$route.query.search || ''
    this.loadAds()
  },
  data() {
    return {
      search: '',
      dialog: false,
      form: {
        name: '',
        description: '',
        address: ''
      }
    }
  },
  computed: {
    ...mapState(['ads', 'user']),
    ...mapGetters(['locale', 'needHelp']),
    headers() {
      return [
        {
          text: this.$t('adName'),
          value: 'name',
          width: '150px'
        },
        {
          text: this.$t('description'),
          value: 'description'
        },
        {
          text: this.$t('address'),
          value: 'address',
          width: '150px'
        },
        {
          text: this.$t('info'),
          value: 'info',
          width: '80px'
        },
        {
          text: this.$t('status'),
          value: 'status',
          width: '90px'
        },
        {
          text: this.$t('action'),
          value: 'action',
          width: '70px'
        }
      ]
    }
  },
  methods: {
    ...mapActions(['loadAdsAction', 'completeAdAction', 'createAdAction']),
    statusToIcon(status) {
      return {
        waiting: {
          icon: 'mdi-account-clock',
          color: 'blue'
        },
        inProgress: {
          icon: 'mdi-truck-delivery',
          color: 'blue'
        },
        completed: {
          icon: 'mdi-check-circle-outline',
          color: 'green'
        },
      }[status]
    },
    itemRowBackground(item) {
      return item.status === 'completed' ? 'completed-row' : ''
    },
    clearSearch() {
      this.search = ''
      this.loadAds()
    },
    loadAds() {
      this.loadAdsAction(this.search)
    },
    errorMessage(field) {
      if (!field.$dirty) return
  
      if (field.hasOwnProperty('required') && !field.required) return this.$t('fieldIsRequired')

      if (field.hasOwnProperty('minLength') && !field.minLength) return this.$t('fieldTooShort')
    },
    async completeAd(id) {
      if (!id) return false

      try {
        await this.completeAdAction(id)
      } catch (e) {
        console.log(e)
      }
    },
    async createAd() {
      this.$v.form.$touch()
      if (this.$v.form.$invalid) return false

      try {
        this.loading = true
        await this.createAdAction({
          ad: this.form
        })
        this.closeDialog()
        this.search = ''
        this.loadAds()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    closeDialog() {
      this.form = {
        name: '',
        description: '',
        address: ''
      }
      this.$v.form.$reset()
      this.dialog = false
    }
  },
  watch: {
    locale() {
      this.loadAds()
    }
  },
  validations() {
    return {
      form: {
        name: {
          required,
          minLength: minLength(6)
        },
        address: {
          required,
          minLength: minLength(6)
        },
        description: {
          required,
          minLength: minLength(6)
        }
      }
    }
  },
}
</script>

<style lang="scss">
  .deliveries-table {
    tbody {
      tr {
        background-color: $element-bg-color;
        td {
          span {
            display: block;
            padding: 5px 0;
          }
        }
      }
    }
  }
  .completed-row {
    background-color: #cbcbcb !important;
  }
</style>
