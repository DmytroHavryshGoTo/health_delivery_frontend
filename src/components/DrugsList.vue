<template>
  <div>
    <h3 style="padding-bottom: 5px">{{ $t('drugs') }}</h3>
    <v-btn
      color="#033a71"
      style="color: #fff;"
      width="100%"
      v-if="!isPreview"
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
            {{ $t('minTemperature') }} {{ drug.minTemperature }} °C
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            {{ $t('maxTemperature') }} {{ drug.maxTemperature }} °C
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            {{ $t('minHumidity') }} {{ drug.minHumidity }} %
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            {{ $t('maxHumidity') }} {{ drug.maxHumidity }} %
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action v-if="!isPreview">
          <v-btn icon @click="() => drugs.splice(idx, 1)">
            <v-icon color="red">mdi-close-circle-outline</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
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
  </div>
</template>

<script>
import { required, minLength, minValue, maxValue } from 'vuelidate/lib/validators'

export default {
  name: 'drugs-list',
  props: {
    drugs: { type: Array, required: true },
    isPreview: { type: Boolean, default: true }
  },
  data() {
    return {
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
    }
  },
  methods: {
    errorMessage(field) {
      if (!field.$dirty) return
  
      if (field.hasOwnProperty('required') && !field.required) return this.$t('fieldIsRequired')

      if (field.hasOwnProperty('minLength') && !field.minLength) return this.$t('fieldTooShort')

      if (field.hasOwnProperty('minValue') && !field.minValue) return this.$t('minValueIsHigher')

      if (field.hasOwnProperty('maxValue') && !field.maxValue) return this.$t('maxValueIsLower')
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
    }
  },
  validations() {
    return {
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