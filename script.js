class World {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.cubeElement = new Cube();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.ambientLight = new THREE.AmbientLight(0x404040, 1.2);
    this.pointLight = new THREE.PointLight(0x404040, 5, 18);

    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener("resize", this.onWindowResize, false);
    this.init();
    this.animate();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    document.body.appendChild(this.renderer.domElement);
    this.scene.background = new THREE.Color(0xaaccff);
    this.pointLight.position.set(-3,6,-3)
    this.pointLight.castShadow = true
    this.pointLight.shadow.camera.near = 0.1
    this.pointLight.shadow.camera.far = 25
    this.scene.add(this.pointLight);
    this.scene.add(this.ambientLight);
    this.scene.fog = new THREE.FogExp2(0xaaccff, 0.0007);
    this.scene.add(this.cubeElement.cube);
    this.camera.position.z = 5;
  }

  animate() {
    requestAnimationFrame(this.animate);

    this.cubeElement.cube.rotation.x += 0.01;
    this.cubeElement.cube.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

class Cube {
  constructor() {
    this.geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    this.material = new THREE.MeshPhongMaterial({ color: 0xff5733 });
    this.cube = new THREE.Mesh(this.geometry, this.material);
  }
}

const world = new World();
