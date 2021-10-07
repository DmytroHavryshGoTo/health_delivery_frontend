<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="users"
        :items-per-page="10"
        :no-data-text="$t('noData')"
        :locale="locale"
        class="elevation-1"
      >
        <template #item.admin="{ item }">
          <v-checkbox v-model="item.admin" readonly></v-checkbox>
        </template>
        <template #item.edit="{ item }">
          <v-btn icon @click="editUser = item">
            <v-icon>mdi-account-edit</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>

    <v-dialog
      v-model="openDialog"
      @click:outside="closeModal"
      width="500px"
    >
      <v-card v-if="!!editUser">
        <v-card-title>{{ $t('editUser') }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editUser.firstName"
            @input="$v.editUser.firstName.$touch"
            :label="$t('firstName')"
            :class="{ clrError: $v.editUser.firstName.$error }"
            :error-messages="errorMessage($v.editUser.firstName)"
            outlined
          />
          <v-text-field
            v-model="editUser.lastName"
            @input="$v.editUser.lastName.$touch"
            :label="$t('lastName')"
            :class="{ clrError: $v.editUser.lastName.$error }"
            :error-messages="errorMessage($v.editUser.lastName)"
            outlined
          />
          <v-text-field
            v-model="editUser.email"
            @input="$v.editUser.email.$touch"
            :label="$t('email')"
            :class="{ clrError: $v.editUser.email.$error }"
            :error-messages="errorMessage($v.editUser.email)"
            outlined
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="secondary"
            @click="closeModal"
          >
          {{ $t('close') }}
          </v-btn>
          <v-btn
            color="#033a71"
            style="color: #fff;"
            @click="updateUser"
          >
          {{ $t('update') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { required, minLength, email } from 'vuelidate/lib/validators'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'users',
  data() {
    return {
      editUser: null
    }
  },
  mounted() {
    this.loadUsersAction()
  },
  computed: {
    ...mapState(['users']),
    ...mapGetters(['locale']),
    headers() {
      return [
        { text: this.$t('firstName'), value: 'firstName' },
        { text: this.$t('lastName'), value: 'lastName' },
        { text: this.$t('email'), value: 'emailName' },
        { text: this.$t('isAdmin'), value: 'admin' },
        { text: '', value: 'edit' }
      ]
    },
    openDialog() {
      return !!this.editUser
    }
  },
  methods: {
    ...mapActions(['loadUsersAction', 'updateUserAction']),
    errorMessage(field) {
      if (!field.$dirty) return
  
      if (field.hasOwnProperty('required') && !field.required) return this.$t('fieldIsRequired')

      if (field.hasOwnProperty('email') && !field.email) return this.$t('invalidEmail')

      if (field.hasOwnProperty('minLength') && !field.minLength) return this.$t('fieldTooShort')
    },
    closeModal() {
      this.editUser = null
      this.$v.$reset()
    },
    async updateUser() {
      this.$v.$touch()
      if (this.$v.$invalid) return false

      try {
        this.freeze = true
        await this.updateUserAction({
          user: this.editUser
        })
        this.editUser = null
      } catch (e) {

      } finally {
        this.freeze = false
      }
    }
  },
  validations() {
    return {
      editUser: {
        firstName: {
          required,
          minLength: minLength(3)
        },
        lastName: {
          required,
          minLength: minLength(3)
        },
        email: { required, email }
      }
    }
  }
}
</script>