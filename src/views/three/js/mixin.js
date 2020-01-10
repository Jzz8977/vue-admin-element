export const myMixin = {
  data() {
    return {
      width: null,
      height: null,
      scene: null,
      cube: null,
      light: null,
      renderer: null,
      camera: null,
      geometry: null,
      material: null,
      mesh: null
    }
  },
  methods: {
    initThree() {
      this.width = document.getElementById('container').clientWidth
      this.height = document.getElementById('container').clientHeight

      this.renderer = new this.$three.WebGLRenderer({
        antialias: true
      })

      this.renderer.setSize(this.width, this.height)
      document.getElementById('container').appendChild(this.renderer.domElement)
    },
    initScene() {
      this.scene = new this.$three.Scene()
    },
    initLight() {
    },
    initCamera() {
      this.camera = new this.$three.PerspectiveCamera(90, this.width / this.height, 1, 1000)
      this.camera.position.x = 600
      this.camera.position.y = 0
      this.camera.position.z = 600
      this.camera.up.x = 0
      this.camera.up.y = 1
      this.camera.up.z = 0

      this.camera.lookAt({
        x: 0,
        y: 0,
        z: 0
      })
    },
    initObject() {
      this.geometry = new this.$three.CubeGeometry(200, 100, 50, 4, 4)
      this.material = new this.$three.MeshLambertMaterial({
        color: 0xFF0000
      })
      this.mesh.position = new this.$three.Mesh(this.geometry, this.material)
      this.scene.add(this.mesh)
    },
    threeStart() {
      this.initThree()
      this.initCamera()
      this.initScene()
      this.initLight()
      this.initScene()
      this.initScene()
    }
  }
}
