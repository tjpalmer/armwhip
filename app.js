webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const _1 = __webpack_require__(2);
	__webpack_require__(12);
	__webpack_require__(5);
	window.onload = main;
	function main() {
	    let game = new _1.Game();
	    // Now kick off the display.
	    game.render();
	}


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(9));
	__export(__webpack_require__(6));
	__export(__webpack_require__(7));
	__export(__webpack_require__(8));


/***/ },
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const three_1 = __webpack_require__(1);
	class Arm {
	    constructor(body) {
	        this.bones = [];
	        this.body = body;
	        this.game = body.game;
	        let { bones } = this;
	        let length = 1;
	        // Keep segments odd, or else weird things happen at exactly 0.5.
	        // Could fix that, but eh.
	        let segmentCount = 7;
	        let segmentLength = length / segmentCount;
	        let boneCount = segmentCount + 1;
	        let prevBone = undefined;
	        for (let i = 0; i < boneCount; ++i) {
	            // Work around types problem.
	            let bone = new three_1.Bone();
	            bones.push(bone);
	            if (prevBone) {
	                bone.position.y = segmentLength;
	                prevBone.add(bone);
	            }
	            else {
	                bone.position.y = -0.5;
	            }
	            prevBone = bone;
	        }
	        let skeleton = new three_1.Skeleton(bones);
	        let geometry = new three_1.CylinderGeometry(0, 0.1, 1, 6, 3 * segmentCount);
	        // Work around typing problem again.
	        let skinIndices = geometry.skinIndices;
	        let skinWeights = geometry.skinWeights;
	        for (let vertex of geometry.vertices) {
	            let y = vertex.y + 0.5;
	            let index = Math.min(Math.floor(y / segmentLength), segmentCount - 1);
	            let weight = (y % segmentLength) / segmentLength;
	            skinIndices.push(new three_1.Vector4(index, index + 1, 0, 0));
	            skinWeights.push(new three_1.Vector4(1 - weight, weight, 0, 0));
	        }
	        let material = body.skinMaterial.clone();
	        material.skinning = true;
	        let mesh = new three_1.SkinnedMesh(geometry, material);
	        mesh.add(bones[0]);
	        mesh.bind(skeleton);
	        let helper = new three_1.SkeletonHelper(mesh);
	        this.mesh = mesh;
	        this.helper = helper;
	    }
	    buildScene() {
	        let { scene } = this.game;
	        scene.add(this.mesh);
	        // scene.add(this.helper);
	    }
	    update() {
	        for (let bone of this.bones) {
	            let targetAngle = this.body.deltaAngle / this.bones.length;
	            bone.rotation.z = bone.rotation.z * 0.9 + targetAngle * 0.1;
	        }
	        this.helper.update();
	    }
	}
	exports.Arm = Arm;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const _1 = __webpack_require__(2);
	const three_1 = __webpack_require__(1);
	class Body {
	    constructor(game) {
	        this.arms = [];
	        this.deltaAngle = 0;
	        this.move = new three_1.Vector3();
	        this.skinMaterial = new three_1.MeshPhongMaterial({ color: 0xA04020, shininess: 10 });
	        this.game = game;
	        let sphere = new three_1.SphereGeometry(0.2, 8, 8, Math.PI / 8);
	        let group = new three_1.Object3D();
	        let top = new three_1.Mesh(sphere, this.skinMaterial);
	        top.scale.x = 0.9;
	        top.scale.z = 0.5;
	        top.translateZ(0.1);
	        top.translateY(-0.1);
	        group.add(top);
	        let armCount = 8;
	        let { arms } = this;
	        for (let i = 0; i < armCount; ++i) {
	            let arm = new _1.Arm(this);
	            arm.mesh.rotateZ(2 * Math.PI * ((i + 0.5) / armCount));
	            arm.mesh.translateY(0.6);
	            arms.push(arm);
	            group.add(arm.mesh);
	        }
	        let middle = new three_1.Mesh(new three_1.SphereGeometry(0.1, 8, 8, Math.PI / 8), this.skinMaterial);
	        middle.translateY(0.05);
	        middle.translateZ(0.05);
	        group.add(middle);
	        group.scale.multiplyScalar(0.5);
	        group.rotateZ(-Math.PI / 2);
	        let mesh = new three_1.Object3D();
	        mesh.add(group);
	        this.mesh = mesh;
	    }
	    buildScene() {
	        this.game.scene.add(this.mesh);
	    }
	    update() {
	        let { mesh, move } = this;
	        let { point } = this.game;
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
	exports.Body = Body;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const three_1 = __webpack_require__(1);
	class Fish {
	    constructor(game) {
	        this.move = new three_1.Vector3();
	        this.work = new three_1.Vector3();
	        this.game = game;
	        let shape = new three_1.SphereGeometry(0.08, 8, 6);
	        shape.scale(1, 0.3, 0.5);
	        let material = new three_1.MeshPhongMaterial({ color: 0x6080C0 });
	        this.mesh = new three_1.Mesh(shape, material);
	        this.mesh.position.z = -0.1;
	        this.spawn();
	    }
	    buildScene() {
	        this.game.scene.add(this.mesh);
	    }
	    edge() {
	        return this.game.camera.right + 0.2;
	    }
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
	        }
	        else {
	            let diff = this.work.copy(this.game.body.mesh.position).sub(this.mesh.position);
	            let distance = diff.length();
	            if (distance < 0.15) {
	                // Eaten.
	                this.spawn();
	            }
	        }
	    }
	}
	exports.Fish = Fish;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const _1 = __webpack_require__(2);
	const three_1 = __webpack_require__(1);
	class Game {
	    constructor() {
	        this.fishes = [];
	        this.point = new three_1.Vector3();
	        let { body } = window.document;
	        // Renderer and camera.
	        let canvas = body.getElementsByTagName('canvas')[0];
	        let renderer = this.renderer = new three_1.WebGLRenderer({ canvas });
	        this.camera = new three_1.OrthographicCamera(-1, 1, 1, -1, 0, 2);
	        this.camera.position.z = 1;
	        // Resize handling after renderer and camera.
	        window.addEventListener('resize', () => this.resize());
	        this.resize();
	        // Scene.
	        let scene = this.scene = new three_1.Scene();
	        scene.background = new three_1.Color(0x665544);
	        scene.add(new three_1.AmbientLight(0xFFFFFF, 0.5));
	        let light = new three_1.DirectionalLight(0xFFFFFF, 1.0);
	        light.position.set(1, 0, 1);
	        scene.add(light);
	        this.body = new _1.Body(this);
	        this.body.buildScene();
	        for (let i = 0; i < 5; ++i) {
	            let fish = new _1.Fish(this);
	            this.fishes.push(fish);
	            fish.buildScene();
	        }
	        // Input.
	        window.document.addEventListener('mousemove', event => {
	            let { clientX, clientY } = event;
	            let { point } = this;
	            point.x = 2 * event.clientX / window.innerWidth - 1;
	            point.y = -(2 * event.clientY / window.innerHeight - 1);
	            point.unproject(this.camera);
	        });
	    }
	    render() {
	        // Prep next frame first for best fps.
	        requestAnimationFrame(() => this.render());
	        this.body.update();
	        for (let fish of this.fishes) {
	            fish.update();
	        }
	        this.renderer.render(this.scene, this.camera);
	    }
	    resize() {
	        this.renderer.setSize(1, 1);
	        let canvas = this.renderer.domElement;
	        window.setTimeout(() => {
	            let space = new three_1.Vector2(window.innerWidth, window.innerHeight);
	            let canvas = this.renderer.domElement;
	            let size = space.clone();
	            let scale = Math.min(space.x, space.y);
	            size.divideScalar(scale);
	            let { camera } = this;
	            camera.left = -size.x;
	            camera.right = size.x;
	            camera.top = size.y;
	            camera.bottom = -size.y;
	            camera.updateProjectionMatrix();
	            this.renderer.setSize(space.x, space.y);
	        }, 10);
	    }
	}
	exports.Game = Game;


/***/ },
/* 10 */,
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports
	
	
	// module
	exports.push([module.id, "canvas{left:0;position:absolute;top:0}", ""]);
	
	// exports


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(11);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./index.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./index.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }
]);