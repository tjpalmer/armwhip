import {Game} from './';
import {Mesh, MeshPhongMaterial, SphereGeometry, Vector3} from 'three';

export class Fish {

  constructor(game: Game) {
    this.game = game;
    let shape = new SphereGeometry(0.08, 8, 6);
    shape.scale(1, 0.3, 0.5);
    let material = new MeshPhongMaterial({color: 0x6080C0});
    this.mesh = new Mesh(shape, material);
    this.mesh.position.z = -0.1;
    this.spawn();
  }

  buildScene() {
    this.game.scene.add(this.mesh);
  }

  edge() {
    return this.game.camera.right + 0.2;
  }

  game: Game;

  mesh: Mesh;

  move = new Vector3();

  spawn() {
    let facing = Math.random() > 0.5 ? 1 : -1;
    this.mesh.position.x = -facing * this.edge() * (1 + 2 * Math.random());
    this.mesh.position.y = 2 * (Math.random() - 0.5) * this.game.camera.top;
    this.move.set(facing * Math.random() * 0.02, 0, 0);
  }

  update() {
    this.mesh.position.add(this.move);
    let facing = Math.sign(this.move.x);
    if (facing * this.mesh.position.x > this.edge()) {
      // Outside screen.
      this.spawn();
    } else {
      let diff =
        this.work.copy(this.game.body.mesh.position).sub(this.mesh.position);
      let distance = diff.length();
      if (distance < 0.15) {
        // Eaten.
        this.spawn();
      } 
    }
  }

  work = new Vector3();

}
