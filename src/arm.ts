import {
  Bone, CylinderGeometry, MeshPhongMaterial, Object3D, Scene, Skeleton,
  SkeletonHelper, SkinnedMesh, Vector4,
} from 'three';

export class Arm {

  constructor() {
    let {bones} = this;
    let length = 1;
    let segmentCount = 7;
    let segmentLength = length / segmentCount;
    let boneCount = segmentCount + 1;
    let prevBone: Bone | undefined = undefined;
    for (let i = 0; i < boneCount; ++i) {
      // Work around types problem.
      let bone = new (Bone as any)();
      bones.push(bone);
      if (prevBone) {
        bone.position.y = segmentLength;
        prevBone.add(bone);
      } else {
        bone.position.y = -0.5;
      }
      prevBone = bone;
    }
    let skeleton = new Skeleton(bones);
    let geometry = new CylinderGeometry(0, 0.1, 1, 6, 3 * segmentCount);
    // Work around typing problem again.
    let skinIndices = geometry.skinIndices as any as Array<Vector4>;
    let skinWeights = geometry.skinWeights as any as Array<Vector4>;
    for (let vertex of geometry.vertices) {
      let y = vertex.y + 0.5;
      let index = Math.min(Math.floor(y / segmentLength), segmentCount - 1);
      let weight = (y % segmentLength) / segmentLength;
      skinIndices.push(new Vector4(index, index + 1, 0, 0));
      skinWeights.push(new Vector4(1 - weight, weight, 0, 0));
    }
    let mesh = new SkinnedMesh(
      geometry, new MeshPhongMaterial({color: 0xA04020, skinning: true}),
    );
    mesh.add(bones[0]);
    mesh.bind(skeleton);
    let helper = new SkeletonHelper(mesh);
    this.mesh = mesh;
    this.helper = helper;
  }

  bones = [] as Array<Bone>;

  buildScene(scene: Scene) {
    scene.add(this.mesh);
    // scene.add(this.helper);
  }

  helper: SkeletonHelper;

  mesh: Object3D;

  update() {
    for (let bone of this.bones) {
      bone.rotation.z = Math.sin(Date.now() * 1e-3) / this.bones.length;
    }
    this.helper.update();
  }

}
