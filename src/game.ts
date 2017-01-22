import {Arm} from './';
import {
  AmbientLight, DirectionalLight,  OrthographicCamera, Scene, Vector2,
  WebGLRenderer,
} from 'three';

export class Game {

  constructor() {
    let {body} = window.document;
    let canvas = body.getElementsByTagName('canvas')[0];
    let renderer = this.renderer = new WebGLRenderer({canvas});
    this.camera = new OrthographicCamera(-1, 1, 1, -1, -1, 1);
    this.camera.position.z = 1;
    // Resize handling after renderer and camera.
    window.addEventListener('resize', () => this.resize());
    this.resize();
    this.scene = new Scene();
    this.scene.add(new AmbientLight(0xFFFFFF, 0.5));
    let light = new DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(1, 0, 1);
    this.scene.add(light);
    this.arm = new Arm();
    this.arm.buildScene(this.scene);
  }

  arm: Arm;

  camera: OrthographicCamera;

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
