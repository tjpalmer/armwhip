import {Arm, Game} from './';
import {Mesh, MeshPhongMaterial, Object3D, SphereGeometry} from 'three';

export class Body {

  constructor(game: Game) {
    this.game = game;
    let sphere = new SphereGeometry(0.2, 8, 8, Math.PI / 8);
    let middle = new Mesh(sphere, this.skinMaterial);
    let armCount = 8;
    let {arms} = this;
    for (let i = 0; i < armCount; ++i) {
      let arm = new Arm(this);
      arm.mesh.rotateZ(2 * Math.PI * ((i + 0.5) / armCount));
      arm.mesh.translateY(0.6);
      arms.push(arm);
      middle.add(arm.mesh);
    }
    middle.scale.multiplyScalar(0.5);
    this.mesh = middle;
  }

  arms = [] as Array<Arm>;

  buildScene() {
    this.game.scene.add(this.mesh);
  }

  game: Game;

  mesh: Object3D;

  skinMaterial = new MeshPhongMaterial({color: 0xA04020});

  update() {
    for (let arm of this.arms) {
      arm.update();
    }
    this.mesh.rotateZ(-this.game.point.x / 200);
  }

}
