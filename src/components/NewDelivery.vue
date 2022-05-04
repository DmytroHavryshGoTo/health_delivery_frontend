<template>
  <v-row>
    <v-col cols="12">
      <div class="delivery-header">
        <h1>
          {{ $t('newDelivery') }}
          <span v-if="ad" class="small-span">
            {{ $t('for') }}
            <a :href="`/ads?search=${ad.name}`">
              {{ ad.name }}
            </a>
            <v-tooltip right v-if="!adValid">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon color="red">mdi-alert-circle</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('youCannotCreateDelivery') }}</span>
            </v-tooltip>
          </span>
        </h1>
        <v-btn
          color="#033a71"
          style="color: #fff;"
          @click="createDelivery"
          :disabled="loading || $v.form.invalid || form.route.length < 2 || !adValid"
        >{{ $t('create') }}</v-btn>
      </div>
    </v-col>
    <v-col cols="4">
      <v-text-field
        v-model="form.name"
        @input="$v.form.name.$touch"
        :label="$t('deliveryName')"
        :class="{ clrError: $v.form.name.$error }"
        :error-messages="errorMessage($v.form.name)"
        outlined
      />
      <v-menu
        ref="menu"
        v-model="dateMenu"
        :close-on-content-click="false"
        :return-value.sync="form.estimatedDeliveryDate"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="form.estimatedDeliveryDate"
            prepend-inner-icon="mdi-calendar"
            readonly
            outlined
            v-bind="attrs"
            v-on="on"
            :label="$t('estimatedDate')"
            :class="{ clrError: $v.form.estimatedDeliveryDate.$error }"
            :error-messages="errorMessage($v.form.estimatedDeliveryDate)"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="form.estimatedDeliveryDate"
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="dateMenu = false"
          >
            {{ $t('close') }}
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.menu.save(form.estimatedDeliveryDate)"
          >
            {{ $t('select') }}
          </v-btn>
        </v-date-picker>
      </v-menu>
      <DrugsList
        :drugs.sync="drugs"
        :isPreview="false"
      />
    </v-col>
    <v-col cols="5">
      <Route
        :route.sync="form.route"
        :endDate="form.estimatedDeliveryDate"
        :isPreview="false"
      />
    </v-col>
  </v-row>
</template>

<script>
import { required, minLength, sameAs } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import DrugsList from './DrugsList.vue'
import Route from './Route.vue'

export default {
  name: 'new-delivery',
  components: { DrugsList, Route },
  data() {
    return {
      form: {
        name: '',
        adId: '',
        estimatedDeliveryDate: '',
        route: [],
      },
      dateMenu: false,
      drugs: [],
      loading: false,
      adValid: true
    }
  },
  mounted() {
    const adId = this.$route.query.ad_id
    if (!adId) return

    this.form.adId = adId
    this.loadAdAction(adId)
  },
  computed: {
    ...mapState(['ad'])
  },
  methods: {
    ...mapActions(['createDeliveryAction', 'loadAdAction']),
    errorMessage(field) {
      if (!field.$dirty) return
  
      if (field.hasOwnProperty('required') && !field.required) return this.$t('fieldIsRequired')

      if (field.hasOwnProperty('minLength') && !field.minLength) return this.$t('fieldTooShort')
    },
    async createDelivery() {
      this.$v.form.$touch()
      if (this.$v.form.$invalid) return false

      try {
        this.loading = true
        await this.createDeliveryAction({
          delivery: this.form,
          drugs: this.drugs,
          adId: this.form.adId
        })
        this.$router.push('/deliveries')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  },
  watch: {
    ad(val) {
      if (!val) return

      if (val.deliveryId) {
        this.adValid = false
        this.$v.adValid.$touch()
      }
    }
  },
  validations() {
    return {
      form: {
        name: {
          required,
          minLength: minLength(3)
        },
        estimatedDeliveryDate: {
          required
        }
      },
      adValid: {
        sameAs: sameAs( () => true )
      }
    }
  }
}
</script>