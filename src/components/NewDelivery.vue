<template>
  <v-row>
    <v-col cols="12">
      <div class="delivery-header">
        <h1>{{ $t('newDelivery') }}</h1>
        <v-btn
          color="#033a71"
          style="color: #fff;"
          @click="createDelivery"
          :disabled="loading || $v.form.invalid || form.route.length < 2"
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
import { required, minLength } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
import DrugsList from './DrugsList.vue'
import Route from './Route.vue'

export default {
  name: 'new-delivery',
  components: { DrugsList, Route },
  data() {
    return {
      form: {
        name: '',
        estimatedDeliveryDate: '',
        route: [],
      },
      dateMenu: false,
      drugs: [],
      loading: false
    }
  },
  methods: {
    ...mapActions(['createDeliveryAction']),
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
          drugs: this.drugs
        })
        this.$router.push('/deliveries')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
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
      }
    }
  }
}
</script>