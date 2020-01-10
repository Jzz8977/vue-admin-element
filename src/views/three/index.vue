<template>
  <div style="height:100%;width:100%">
    <div id="container" style="height:800px" />
  </div>
</template>

<script>
import OrbitControls from 'three-orbitcontrols'
export default {
  name: 'Index',
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
      mesh: null,
      earthMesh: null,
      cloundMesh: null,
      control: null,
      Shaders: {
        'earth': {
          uniforms: {
            'texture': { type: 't', value: new this.$three.TextureLoader().load(require('../../assets/3D/world.jpg')) }
          },
          vertexShader: [
            'varying vec3 vNormal;',
            'varying vec2 vUv;',
            'void main() {',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            'vNormal = normalize( normalMatrix * normal );',
            'vUv = uv;',
            '}'
          ].join('\n'),
          fragmentShader: [
            'uniform sampler2D texture;',
            'varying vec3 vNormal;',
            'varying vec2 vUv;',
            'void main() {',
            'vec3 diffuse = texture2D( texture, vUv ).xyz;',
            'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
            'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
            'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
            '}'
          ].join('\n')
        },
        'atmosphere': {
          uniforms: {},
          vertexShader: [
            'varying vec3 vNormal;',
            'void main() {',
            'vNormal = normalize( normalMatrix * normal );',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}'
          ].join('\n'),
          fragmentShader: [
            'varying vec3 vNormal;',
            'void main() {',
            'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
            'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
            '}'
          ].join('\n')
        }
      }
    }
  },
  mounted() {
    this.threeStart()
  },
  methods: {
    threeStart() {
      this.initThree()
      this.initCamera()
      this.initScene()
      this.initLight()
      this.initObject()
      // this.initEarthLight()
      this.animation()
    },
    animation() {
      this.control.update()
      // 地球自转
      this.earthMesh.rotation.y -= 0.002
      // 漂浮的云层
      // this.cloudsMesh.rotation.y -= 0.005
      // this.cloudsMesh.rotation.z += 0.005
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(this.animation)
    },
    initEarthLight() {
      var material2 = new this.$three.ShaderMaterial({
        uniforms: this.GlowSphere.uniforms,
        vertexShader: this.GlowSphere.vertexShader,
        fragmentShader: this.GlowSphere.fragmentShader,
        blending: this.$three.NormalBlending,
        transparent: true
      })
      var sphere2 = new this.$three.SphereBufferGeometry(10, 32, 32)
      var mesh2 = new this.$three.Mesh(sphere2, material2)
      // mesh2.position.x = 15;
      this.scene.add(mesh2)
    },
    initThree() {
      this.width = document.getElementById('container').clientWidth
      this.height = document.getElementById('container').clientHeight
      this.renderer = new this.$three.WebGLRenderer({
        antialias: true,
        alpha: true
      })
      this.renderer.setSize(this.width, this.height)
      document.getElementById('container').appendChild(this.renderer.domElement)
      this.renderer.shadowMap.enabled = true
      this.renderer.setClearColor(0x000000, 1.0)
    },
    initCamera() {
      this.camera = new this.$three.PerspectiveCamera(75, this.width / this.height, 0.1, 1000)
      this.camera.position.x = -500
      this.camera.position.y = 500
      this.camera.position.z = -500

      // this.camera.lookAt(new this.$three.Vector3(20, 10, 0))
    },
    initScene() {
      this.scene = new this.$three.Scene()
    },
    initLight() {
      // this.light = new this.$three.AmbientLight(0xFF0000)
      // this.light.position.set(100, 100, 200)
      // this.scene.add(this.light)
      // A light source positioned directly above the scene, with color fading from the sky color to the ground color.
      // 位于场景正上方的光源，颜色从天空颜色渐变为地面颜色。
      //  var light = new this.$three.HemisphereLight(0xffffbb, 0x080820, 1);
      // scene.add(light);

      // 环境光
      this.light = new this.$three.AmbientLight(0xFFFFFF)
      this.light.position.set(100, 100, 200)
      this.scene.add(this.light)

    // 平行光
    // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
    // light = new this.$three.DirectionalLight(0xffffbb, 1);
    // light.position.set(-1, 1, 1);
    // scene.add(light);
    },
    initObject() {
      this.initEarth()
      // this.initCloudes()
      this.control = new this.$three.OrbitControls(this.camera, this.renderer.domElement)
    },
    initEarth() {
      const shaders = this.Shaders['earth']
      // 实例化一个半径为 200 的球体
      var earthGeo = new this.$three.SphereGeometry(200, 100, 100)
      var earthMater = new this.$three.ShaderMaterial({
        map: new this.$three.TextureLoader().load(require('../../assets/3D/world.jpg')),
        uniforms: shaders.uniforms,
        vertexShader: shaders.vertexShader,
        fragmentShader: shaders.fragmentShader
      })

      this.earthMesh = new this.$three.Mesh(earthGeo, earthMater)
      this.scene.add(this.earthMesh)
    },
    initCloudes() {
      // 实例化一个球体，半径要比地球的大一点，从而实现云飘咋地球上的感觉
      var cloudsGeo = new this.$three.SphereGeometry(201, 100, 100)

      // transparent 与 opacity 搭配使用，设置材质的透明度，当 transparent 设为 true 时， 会对材质特殊处理，对性能会有些损耗。
      var cloudsMater = new this.$three.MeshPhongMaterial({
        alphaMap: new this.$three.TextureLoader().load(require('../../assets/3D/clouds.png')),
        transparent: true,
        opacity: 0.2
      })

      this.cloudsMesh = new this.$three.Mesh(cloudsGeo, cloudsMater)
      this.scene.add(this.cloudsMesh)
    }

  }
}
</script>

<style lang="scss" scoped>
#container{
    width: 100%;
}
</style>
