<template>
  <div>
    <v-row
      v-for="item in deliveries"
      :key="item.id"
      class="short-delivery-card"
    >
      <v-col cols="3">
        <v-btn icon :to="`deliveries/${item.id}`">
          <v-icon v-if="item.status === 'preparing_to_deliver'">mdi-package-variant-closed</v-icon>
          <v-icon v-if="item.status === 'delivering'">mdi-truck-delivery</v-icon>
          <v-icon v-else-if="item.status === 'delivered'">mdi-package-variant</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="9">
        <h4>{{ item.name }} <span>{{ item.createdAt }} - {{ item.estimatedDeliveryDate }}</span></h4>
        <p>{{ item.ttn }}</p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'small-delivery-list',
  props: {
    deliveries: { type: Array, required: true }
  }
}
</script>

<style lang="scss" scoped>
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
        font-size: 60px !important;
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
</style>