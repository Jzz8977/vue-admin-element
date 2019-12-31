<template>
  <div>
    <Details :is-edit="isEdit" />
  </div>
</template>

<script>
import Details from './components/details'
export default {
  name: 'Create',
  components: {
    Details
  },
  data() {
    return {
      isEdit: false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
