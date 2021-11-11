<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component({
  name: 'App',
  mpType: 'App',
})
export default class extends Vue {
  onLaunch () {
    console.log('App Launch')
  }

  onShow () {
    console.log('App Show')
  }

  onHide () {
    console.log('App Hide')
  }
}
</script>

<style>
    /*每个页面公共css */
</style>
