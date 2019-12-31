<template>
  <div>
    <Details :is-edit="isEdit" />
  </div>
</template>

<script>
import Details from './components/details'

export default {
  name: 'Edit',
  components: {
    Details
  },
  data() {
    return {
      isEdit: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
