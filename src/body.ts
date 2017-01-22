import {Arm, Game} from './';
import {
  Mesh, MeshPhongMaterial, Object3D, SphereGeometry, Vector3,
} from 'three';

export class Body {

  constructor(game: Game) {
    this.game = game;
    let sphere = new SphereGeometry(0.2, 8, 8, Math.PI / 8);
    let group = new Object3D();
    let top = new Mesh(sphere, this.skinMaterial);
    top.scale.x = 0.9;
    top.scale.z = 0.5;
    top.translateZ(0.1);
    top.translateY(-0.1);
    group.add(top);
    let armCount = 8;
    let {arms} = this;
    for (let i = 0; i < armCount; ++i) {
      let arm = new Arm(this);
      arm.mesh.rotateZ(2 * Math.PI * ((i + 0.5) / armCount));
      arm.mesh.translateY(0.6);
      arms.push(arm);
      group.add(arm.mesh);
    }
    let middle = new Mesh(
      new SphereGeometry(0.1, 8, 8, Math.PI / 8), this.skinMaterial,
    );
    middle.translateY(0.05);
    middle.translateZ(0.05);
    group.add(middle);
    group.scale.multiplyScalar(0.5);
    group.rotateZ(-Math.PI / 2);
    let mesh = new Object3D();
    mesh.add(group);
    this.mesh = mesh;
  }

  arms = [] as Array<Arm>;

  buildScene() {
    this.game.scene.add(this.mesh);
  }

  deltaAngle = 0;

  game: Game;

  mesh: Object3D;

  move = new Vector3();

  skinMaterial = new MeshPhongMaterial({color: 0xA04020, shininess: 10});

  update() {
    let {mesh, move} = this;
    let {point} = this.game;
    // Delta angle.
    move.copy(point).sub(mesh.getWorldPosition());
    let distance = move.length();
    let bodyAngle = mesh.rotation.z % (2 * Math.PI);
    let mouseAngle = Math.atan2(move.y, move.x);
    let deltaAngle = mouseAngle - bodyAngle;
    if (Math.abs(deltaAngle) > Math.PI) {
      deltaAngle -= 2 * Math.PI * Math.sign(deltaAngle);
    }
    if (distance < 0.01) {
      // Help to avoid creepy vibrations at center.
      deltaAngle *= distance;
    }
    this.deltaAngle = deltaAngle;
    for (let arm of this.arms) {
      arm.update();
    }
    mesh.rotateZ(deltaAngle / 100);
    // Move.
    let speed = Math.min(move.length() * 0.1, 0.02);
    speed *= 1 - Math.abs(deltaAngle / Math.PI);
    move.normalize().multiplyScalar(speed);
    mesh.position.add(move);
  }

}
