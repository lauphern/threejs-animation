const THREE = require("three");
const OrbitControls = require("three-orbit-controls")(THREE);
const POSTPROCESSING = require("postprocessing");

class World {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      85,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.cubeElement = new Cube();
    this.planeElement = new Plane();
    this.firstLine = new Quote(
      "Home is not where you are born;",
      [0, 1, 5]
    );
    this.secondLine = new Quote(
      "home is where all your attempts",
      [0, 0, 5]
    );
    this.thirdLine = new Quote(
      "to escape cease",
      [0, -1, 5],
      this.init.bind(this)
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.controls;
    this.ambientLight = new THREE.AmbientLight(0x404040, 1.2);
    this.pointLight = new THREE.PointLight(0x404040, 5, 18);

    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener("resize", this.onWindowResize, false);

    this.composer = new POSTPROCESSING.EffectComposer(this.renderer);
    this.composer.addPass(
      new POSTPROCESSING.RenderPass(this.scene, this.camera)
    );
    const hueSaturationEffect = new POSTPROCESSING.HueSaturationEffect({
      saturation: -1
    });

    // const effectPass = new POSTPROCESSING.EffectPass(
    //   this.camera,
    //   new POSTPROCESSING.BloomEffect(),
    //   hueSaturationEffect
    // );
    // effectPass.renderToScreen = true;
    // this.composer.addPass(effectPass);
    // const bloomPass = new BloomPass(
    //   1, // strength
    //   25, // kernel size
    //   4, // sigma ?
    //   256 // blur render target resolution
    // );
    // composer.addPass(bloomPass);
    // const filmPass = new FilmPass(
    //   0.35, // noise intensity
    //   0.025, // scanline intensity
    //   648, // scanline count
    //   false // grayscale
    // );
    // filmPass.renderToScreen = true;
    // composer.addPass(filmPass);
    this.animate();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    document.body.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.scene.background = new THREE.Color(0xaaccff);
    this.pointLight.position.set(-3, 6, 10);
    this.pointLight.castShadow = true;
    this.pointLight.shadow.camera.near = 0.1;
    this.pointLight.shadow.camera.far = 25;
    this.scene.add(this.pointLight);
    this.scene.add(this.ambientLight);
    this.scene.fog = new THREE.FogExp2(0xaaccff, 0.0007);
    this.scene.add(this.cubeElement.cube);
    this.scene.add(this.planeElement.plane);
    this.scene.add(this.firstLine.text);
    this.scene.add(this.secondLine.text);
    this.scene.add(this.thirdLine.text);
    // this.camera.position.set(-5.2, 1, 7.5);
    this.camera.position.set(0, -2, 8.5);
    this.controls.update();
  }

  animate() {
    requestAnimationFrame(this.animate);

    this.cubeElement.cube.rotation.x += 0.01;
    this.cubeElement.cube.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
    // this.composer.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

class Cube {
  constructor() {
    this.geometry = new THREE.SphereBufferGeometry(1.5, 7, 7);
    this.material = new THREE.MeshPhongMaterial({ color: 0xff5733 });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.init = this.init.bind(this);
    this.init();
  }

  init() {
    this.cube.receiveShadow = true;
    this.cube.castShadow = true;
  }
}

class Plane {
  constructor() {
    this.geometry = new THREE.PlaneBufferGeometry(1000, 1000);
    this.material = new THREE.ShadowMaterial({
      opacity: 0.15
    });
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.init = this.init.bind(this);
    this.init();
  }
  init() {
    this.plane.position.y = -50;
    this.plane.position.x = 0;
    this.plane.position.z = 0;
    this.plane.rotation.x = (Math.PI / 180) * -90;
    this.plane.receiveShadow = true;
  }
}

class Quote {
  constructor(qt, coordinates, cb) {
    this.qt = qt;
    this.textLoader = new THREE.FontLoader();
    this.geometry;
    this.material = new THREE.MeshPhongMaterial({
      color: 0xff5733
    });
    this.text;
    this.init = this.init.bind(this);
    this.init(coordinates, cb);
  }

  init(coordinates, cb) {
    this.textLoader.load("fonts/Dosis_Regular.json", font => {
      this.geometry = new THREE.TextBufferGeometry(this.qt, {
        font: font,
        size: 0.7,
        height: 0.02,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02
      });
      this.geometry.center();
      this.text = new THREE.Mesh(this.geometry, this.material);
      this.text.position.set(...coordinates);
      if(cb) cb();
    });
  }
}

const world = new World();
