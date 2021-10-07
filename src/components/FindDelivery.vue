<template>
  <div class="card">
    <v-skeleton-loader
      v-if="loading"
      v-bind="loaderOptions"
      type="card-avatar, article, actions"
    ></v-skeleton-loader>
    <template v-else>
      <h3>{{ $t('findParcel') }}</h3>
      <v-text-field
        filled
        rounded
        dense
        :label="$t('parcelNumber')"
      >
        <template v-slot:append>
          <v-btn
            class="find-delivery"
            color="#033a71"
          >{{ $t('find') }}</v-btn>
        </template>
      </v-text-field>
      <h5 style="padding-bottom: 30px;">{{ $t('lastDeliveries') }}</h5>
      <v-row
        v-for="item in lastDeliveries"
        :key="item.number"
        class="short-delivery-card"
      >
        <v-col cols="3">
          <v-btn icon :to="`deliveries/${item.id}`">
            <v-icon v-if="item.status === 'delivering'">mdi-package-variant-closed</v-icon>
            <v-icon v-else-if="item.status === 'delivered'">mdi-package-variant</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="9">
          <h4>{{ item.number }} <span>{{ item.date }}</span></h4>
          <p>{{ item.description }}</p>
        </v-col>
      </v-row>
      <v-row style="justify-content: center;">
        <v-btn class="seeAll" to="/deliveries">
          {{ $t('seeAll') }}
        </v-btn>
      </v-row>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loaderOptions: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2
      },
      loading: true,
      lastDeliveries: [
        {
          id: 1,
          status: 'delivered',
          number: '0987654567890',
          date: '07:14-26.06',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur soluta officiis porro earum voluptatum.'
        },
        {
          id: 2,
          status: 'delivering',
          number: '4567890987654',
          date: '07:14-26.06',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur soluta officiis porro earum voluptatum.'
        },
        {
          id: 3,
          status: 'delivering',
          number: '2345677654567',
          date: '07:14-26.06',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur soluta officiis porro earum voluptatum.'
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => this.loading = false, 1500)
  }
}
</script>

<style scoped lang="scss">
  .card {
    .find-delivery {
      border-radius: 20px;
      color: #fff;
    }
    .seeAll {
      margin: 20px 0;
      border-radius: 20px;
    }
    .short-delivery-card {
      padding: 0;
      background-color: #fbfbfb;
      border-radius: 5px;
      -webkit-box-shadow: 0px 5px 23px 2px rgba(34, 60, 80, 0.03);
      -moz-box-shadow: 0px 5px 23px 2px rgba(34, 60, 80, 0.03);
      box-shadow: 0px 5px 23px 2px rgba(34, 60, 80, 0.03);
      margin: 10px 0;
      &>div {
        &:first-child {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        i {
          font-size: 60px;
        }
        p {
          font-size: 12px;
        }
        h4 {
          display: flex;
          justify-content: space-between;
          span {
            font-size: 10px;
            color: grey;
          }
        }
      }
    }
  }
</style>