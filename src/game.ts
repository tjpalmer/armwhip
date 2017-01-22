import {Arm} from './';
import {
  AmbientLight, DirectionalLight,  OrthographicCamera, Scene, Vector2, Vector3,
  WebGLRenderer,
} from 'three';

export class Game {

  constructor() {
    let {body} = window.document;
    // Renderer and camera.
    let canvas = body.getElementsByTagName('canvas')[0];
    let renderer = this.renderer = new WebGLRenderer({canvas});
    this.camera = new OrthographicCamera(-1, 1, 1, -1, -1, 1);
    this.camera.position.z = 1;
    // Resize handling after renderer and camera.
    window.addEventListener('resize', () => this.resize());
    this.resize();
    // Scene.
    this.scene = new Scene();
    this.scene.add(new AmbientLight(0xFFFFFF, 0.5));
    let light = new DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(1, 0, 1);
    this.scene.add(light);
    this.arm = new Arm(this);
    this.arm.buildScene(this.scene);
    // Input.
    window.document.addEventListener('mousemove', event => {
      let {clientX, clientY} = event;
      let {point} = this;
      point.x = 2 * event.clientX / window.innerWidth - 1;
      point.y = -(2 * event.clientY / window.innerHeight - 1);
      point.unproject(this.camera);
    });
  }

  arm: Arm;

  camera: OrthographicCamera;

  point = new Vector3();

  render() {
    // Prep next frame first for best fps.
    requestAnimationFrame(() => this.render());
    this.arm.update();
    this.renderer.render(this.scene, this.camera);
  }

  renderer: WebGLRenderer;

  resize() {
    this.renderer.setSize(1, 1);
    let canvas = this.renderer.domElement;
    window.setTimeout(() => {
      let space = new Vector2(window.innerWidth, window.innerHeight);
      let canvas = this.renderer.domElement;
      let size = space.clone();
      let scale = Math.min(space.x, space.y);
      size.divideScalar(scale);
      let {camera} = this;
      camera.left = -size.x;
      camera.right = size.x;
      camera.top = size.y;
      camera.bottom = -size.y;
      camera.updateProjectionMatrix();
      this.renderer.setSize(space.x, space.y);
    }, 10);
  }

  scene: Scene;

}
