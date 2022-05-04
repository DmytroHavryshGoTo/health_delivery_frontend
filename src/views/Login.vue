<template>
  <v-container :fluid="true">
    <v-row class="login-wrapper">
      <v-col xs="12" lg="3" md="5" >
        <v-select
          outlined
          dense
          class="locale-select"
          v-model="locale"
          :items="['en', 'uk']"
          @change="changeLocale"
        />
        <v-form>
          <v-icon>mdi-shield-key</v-icon>
          <template v-if="signUp">
            <v-text-field
              v-model="form.firstName"
              @input="$v.form.firstName.$touch"
              :label="$t('firstName')"
              :class="{ clrError: $v.form.firstName.$error }"
              :error-messages="errorMessage($v.form.firstName)"
              outlined
            />
            <v-text-field
              v-model="form.lastName"
              @input="$v.form.lastName.$touch"
              :label="$t('lastName')"
              :class="{ clrError: $v.form.lastName.$error }"
              :error-messages="errorMessage($v.form.lastName)"
              outlined
            />
            <v-text-field
              v-model="form.phoneNumber"
              @input="$v.form.phoneNumber.$touch"
              :label="$t('phoneNumber')"
              :hint="$t('phoneExample')"
              :class="{ clrError: $v.form.phoneNumber.$error }"
              :error-messages="errorMessage($v.form.phoneNumber)"
              outlined
            />
          </template>
          <v-text-field
            v-model="form.email"
            @input="$v.form.email.$touch"
            :label="$t('email')"
            :class="{ clrError: $v.form.email.$error }"
            :error-messages="errorMessage($v.form.email)"
            outlined
          />
          <v-text-field
            v-model="form.password"
            @input="$v.form.password.$touch"
            :label="$t('password')"
            :class="{ clrError: $v.form.password.$error }"
            :error-messages="errorMessage($v.form.password)"
            type="password"
            outlined
          />
          <v-checkbox
            v-if="signUp"
            v-model="form.needHelp"
            :label="$t('needHelp')"
            outlined
          />
          <v-btn
            color="#033a71"
            style="color: #fff;"
            width="100%"
            :disabled="loading"
            @click="signUp ? signUpUser() : loginUser()"
          >{{ signUp ? $t('signUp') : $t('login') }}</v-btn>
          <p class="sign-up-link">
            <a href="#" @click.prevent="signUp = !signUp">{{ signUp ? $t('login') : $t('signUp') }}</a>
          </p>
          <div
            class="error-banner"
            v-if="errorMsg"
          >
            <v-icon
              slot="icon"
              color="warning"
              size="36"
            >
              mdi-alert-circle
            </v-icon>
            {{ errorMsg }}
          </div>
        </v-form>
      </v-col>
      <v-col lg="9" md="7" xs="12">
        <v-icon dark>mdi-hospital-box-outline</v-icon>
        <h1>HEALTH <br>DELIVERY</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'
import { required, minLength, email, requiredIf } from 'vuelidate/lib/validators'

export default Vue.extend({
  name: 'login',
  data: () => ({
    locale: '',
    errorMsg: '',
    signUp: false,
    form: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      needHelp: false
    },
    loading: false
  }),
  mounted() {
    this.locale = localStorage.getItem('locale') || 'en'
  },
  methods: {
    ...mapActions(['loginUserAction', 'signUpUserAction']),
    changeLocale(val) {
      this.$i18n.locale = val
      this.$vuetify.lang.current = val
      localStorage.setItem('locale', val)
    },
    errorMessage(field) {
      if (!field.$dirty) return
  
      if (field.hasOwnProperty('required') && !field.required) return this.$t('fieldIsRequired')

      if (field.hasOwnProperty('email') && !field.email) return this.$t('invalidEmail')

      if (field.hasOwnProperty('minLength') && !field.minLength) return this.$t('fieldTooShort')
    },
    async loginUser() {
      this.$v.$touch()
      if (this.$v.$invalid) return false

      this.loading = true
      try {
        await this.loginUserAction(this.form)
        this.$router.push('/')
      } catch (e) {
        console.log(e)
        this.errorMsg = e.error
      } finally {
        this.loading = false
      }      
    },
    async signUpUser() {
      this.$v.$touch()
      if (this.$v.$invalid) return false

      this.loading = true
      try {
        await this.signUpUserAction(this.form)
        this.form = {
          ...this.form,
          firstName: '',
          lastName: '',
          password: '',
          phoneNumber: '',
          needHelp: false
        }
        this.errorMsg = ''
        this.$v.$reset()
        this.signUp = false
      } catch (e) {
        console.log(e)
        this.errorMsg = e.error
      } finally {
        this.loading = false
      }  
    }
  },
  validations() {
    return {
      form: {
        firstName: {
          required: requiredIf(function() {
            return this.signUp
          }),
          minLength: minLength(this.signUp ? 3 : 0)
        },
        lastName: {
          required: requiredIf(function() {
            return this.signUp
          }),
          minLength: minLength(this.signUp ? 3 : 0)
        },
        phoneNumber: {
          required: requiredIf(function() {
            return this.signUp
          }),
          minLength: minLength(this.signUp ? 13 : 0)
        },
        email: { required, email },
        password: { required, minLength: minLength(6) }
      }
    }
  },
  watch: {
    signUp() {
      this.$v.$reset()
    } 
  }
})
</script>

<style lang="scss" scoped>
  $primary-color: #033a71;

  .login-wrapper {
    height: 100vh;
    &>div {
      &:first-child {
        background-color: aliceblue;
        display: flex;
        justify-content: center;
        align-items: center;
        form {
          width: 100%;
          text-align: center;
          .sign-up-link {
            text-align: right;
            margin: 0;
            padding: 10px;
            a {
              color: $primary-color;
              font-size: 14px;
              text-decoration: none;
            }
          }
          i {
            color: #033a71;
            font-size: 60px;
            padding-bottom: 20px;
          }
          .error-banner {
            border: 1px solid #fb8c00;
            border-radius: 5px;
            padding: 5px;
            i {
              padding-bottom: 0;
            }
          }
        }
        .locale-select {
          position: fixed;
          top: 20px;
          left: 20px;
          width: 80px;
        }
      }
      &:last-child {
        background-color: $primary-color;
        display: flex;
        align-items: center;
        justify-content: center;
        h1 {
          color: #fff;
        }
        i {
          font-size: 90px;
        }
      }
    }
  }
</style>