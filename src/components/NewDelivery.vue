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
      <h3 style="padding-bottom: 5px">{{ $t('drugs') }}</h3>
      <v-btn
        color="#033a71"
        style="color: #fff;"
        width="100%"
        @click="addNewDrug"
      >
        <v-icon>mdi-plus-circle-outline</v-icon>
      </v-btn>
      <v-list 
        subheader
        two-line
        class="drugs-list overflow-y-auto"
      >
        <v-list-item
          class="card"
          v-for="(drug, idx) in drugs"
          :key="idx"
        >
          <v-list-item-avatar>
            <v-icon
              v-text="'mdi-pill'"
            ></v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="drug.name"></v-list-item-title>

            <v-list-item-subtitle>
              {{ $t('minTemperature') }} {{ drug.minTemperature }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ $t('maxTemperature') }} {{ drug.maxTemperature }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ $t('minHumidity') }} {{ drug.minHumidity }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ $t('maxHumidity') }} {{ drug.maxHumidity }}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon @click="() => drugs.splice(idx, 1)">
              <v-icon color="red">mdi-close-circle-outline</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col cols="5">
      <h3 style="margin-top: -28px;">{{ $t('route') }}</h3>
      <div style="display: flex;">
        <v-text-field
          v-model.trim="newStation"
          outlined
          :label="$t('newStation')"
          append-icon="mdi-plus-circle-outline"
          @click:append="addNewStation"
          @keypress.enter="addNewStation"
        >
        </v-text-field>
      </div>
      <v-timeline
        align-top
        dense
        class="overflow-y-auto" style="max-height: 480px;"
      >
        <v-timeline-item
          v-for="(station, idx) in form.route"
          :key="idx"
          color="#033a71"
          small
        >
          <v-row class="pt-1">
            <v-col cols="6">
              <strong>{{ station.name }}</strong>
            </v-col>
            <v-col cols="4" v-if="idx === 0">
              <strong>{{ $t('startPoint') }}</strong>
              <div class="text-caption">
                {{ todayDate }}
              </div>
            </v-col>
            <v-col cols="4" v-else-if="idx === form.route.length - 1">
              <strong>{{ $t('endPoint') }}</strong>
              <div class="text-caption" v-if="form.estimatedDeliveryDate">
                {{ form.estimatedDeliveryDate }}
              </div>
            </v-col>
            <v-col cols="4" v-else></v-col>
            <v-col cols="2">
              <v-btn icon @click="() => form.route.splice(idx, 1)">
                <v-icon color="red">mdi-close-circle-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-timeline-item>
      </v-timeline>
    </v-col>
    <v-dialog persistent width="500" v-model="addDrug">
      <v-card v-if="newDrug">
        <v-card-title>
          {{ $t('addNewDrug') }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newDrug.name"
            @input="$v.newDrug.name.$touch"
            :label="$t('name')"
            :class="{ clrError: $v.newDrug.name.$error }"
            :error-messages="errorMessage($v.newDrug.name)"
            outlined
          >
          </v-text-field>
          <v-text-field
            v-model="newDrug.containerId"
            @input="$v.newDrug.containerId.$touch"
            :label="$t('containerId')"
            :class="{ clrError: $v.newDrug.containerId.$error }"
            :error-messages="errorMessage($v.newDrug.containerId)"
            outlined
          >
          </v-text-field>
          <v-text-field
            v-model="newDrug.minTemperature"
            @input="$v.newDrug.minTemperature.$touch"
            :label="$t('minTemperature') + ' °C | -70 > x > 70'"
            :class="{ clrError: $v.newDrug.minTemperature.$error }"
            :error-messages="errorMessage($v.newDrug.minTemperature)"
            outlined
          >
          </v-text-field>
          <v-text-field
            v-model="newDrug.maxTemperature"
            @input="$v.newDrug.maxTemperature.$touch"
            :label="$t('maxTemperature') + ' °C | -70 > x > 70'"
            :class="{ clrError: $v.newDrug.maxTemperature.$error }"
            :error-messages="errorMessage($v.newDrug.maxTemperature)"
            outlined
          >
          </v-text-field>
          <v-text-field
            v-model="newDrug.minHumidity"
            @input="$v.newDrug.minHumidity.$touch"
            :label="$t('minHumidity') + ' % | 0 > x > 100'"
            :class="{ clrError: $v.newDrug.minHumidity.$error }"
            :error-messages="errorMessage($v.newDrug.minHumidity)"
            outlined
          >
          </v-text-field>
          <v-text-field
            v-model="newDrug.maxHumidity"
            @input="$v.newDrug.maxHumidity.$touch"
            :label="$t('maxHumidity') + ' % | 0 > x > 100'"
            :class="{ clrError: $v.newDrug.maxHumidity.$error }"
            :error-messages="errorMessage($v.newDrug.maxHumidity)"
            outlined
            type="number"
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="secondary"
            @click="closeAddNewDrug"
          >{{ $t('close') }}</v-btn>
          <v-btn
            color="#033a71"
            style="color: #fff;"
            @click="saveNewDrug"
          >{{ $t('add') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { required, minLength, minValue, maxValue } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      todayDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      form: {
        name: '',
        estimatedDeliveryDate: '',
        route: [],
      },
      dateMenu: false,
      drugs: [],
      addDrug: false,
      newDrug: null,
      tempDrugValidations: {
        required,
        minValue: minValue(-70),
        maxValue: maxValue(70)
      },
      humDrugValidations: {
        required,
        minValue: minValue(0),
        maxValue: maxValue(100)
      },
      newStation: '',
      loading: false
    }
  },
  methods: {
    ...mapActions(['createDeliveryAction']),
    errorMessage(field) {
      if (!field.$dirty) return
  
      if (field.hasOwnProperty('required') && !field.required) return this.$t('fieldIsRequired')

      if (field.hasOwnProperty('email') && !field.email) return this.$t('invalidEmail')

      if (field.hasOwnProperty('minLength') && !field.minLength) return this.$t('fieldTooShort')

      if (field.hasOwnProperty('minValue') && !field.minLength) return this.$t('minValueIsHigher')

      if (field.hasOwnProperty('maxValue') && !field.minLength) return this.$t('maxValueIsLower')
    },
    addNewStation() {
      if (!this.newStation) return

      this.form.route.push({
        name: this.newStation
      })
      this.newStation = ''
    },
    addNewDrug() {
      this.newDrug = {
        name: '',
        containerId: '',
        minTemperature: 0,
        maxTemperature: 0,
        minHumidity: 0,
        maxHumidity: 0
      }
      this.addDrug = true
    },
    saveNewDrug() {
      this.$v.newDrug.$touch()
      if (this.$v.newDrug.$invalid) return false

      this.drugs.push(this.newDrug)
      this.closeAddNewDrug()
    },
    closeAddNewDrug() {
      this.addDrug = false
      this.newDrug = null
      this.$v.newDrug.$reset()
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
      },
      newDrug: {
        name: {
          required,
          minLength: minLength(3)
        },
        containerId: {
          required,
          minLength: minLength(1) 
        },
        minTemperature: this.tempDrugValidations,
        maxTemperature: this.tempDrugValidations,
        minHumidity: this.humDrugValidations,
        maxHumidity: this.humDrugValidations
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .drugs-list {
    background-color: $element-bg-color;
    border-radius: 5px;
    max-height: 420px;
    padding: 10px;
    .v-list-item {
      margin: 10px 0;
    }
    .card {
      padding: 2px 10px;
    }
  }
</style>