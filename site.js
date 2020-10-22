import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
//import * as TWEEN from '/Tween';

var modal_container = document.getElementById("modal-container");
var modal_title = document.getElementById("modal-title");
var modal_desc = document.getElementById("modal-desc");
var modal_img = document.getElementById("modal-img");
var modal_name = document.getElementById("modal-name");
var close = document.getElementById("close");
var cubeCount, material, raycaster, geometry;
var scene, camera, renderer, controls;
var cube = [];

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("White");
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  SceneLighting();
  SceneControls();
 // geoHandler();
}

function SceneLighting() {
  var light1 = new THREE.PointLight(0xffffff, 4, 50);
  light1.position.set(0, 300, 500);
  scene.add(light1);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
  directionalLight.position.set(5, 5, 10);

  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    5
  );
  const hemisphereLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 3);
  scene.add(directionalLight, directionalLightHelper, hemisphereLight);
}

function SceneControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  controls.minDistance = 1;
  controls.maxDistance = 50;
  controls.enableDamping = true;
  controls.dampingFactor = 0.2;
  camera.position.z = 5;
}

var mouse = new THREE.Vector2(),
  INTERSECTED;
raycaster = new THREE.Raycaster();
document.addEventListener("click", onDocumentMouseClick, false);

geometry = new THREE.PlaneBufferGeometry(1.5, 1.5);




function onDocumentMouseClick(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}



function scaleUp() {


}

function scaleDown() {
  
}


var Airtable = require("airtable");
var base = new Airtable({ apiKey: "keyMKnZBFsdFtC0UX" }).base(
  "app7x77PDdblrFWMR"
);

cubeCount = 0;
base("Table 3")
  .select({
    maxRecords: 50,
    view: "Grid view",
  })
  .eachPage(
    function page(records, fetchNextPage) {
      records.forEach(function (record) {
        cubeCount++;
        //var texture = new THREE.TextureLoader().load(record.fields.Img);
        material = new THREE.MeshBasicMaterial({
          color: Math.random() * 0xffffff,
        });
        cube[cubeCount] = new THREE.Mesh(geometry, material);
        cube[cubeCount].position.x = Math.random() * 2 - 1;
        cube[cubeCount].position.y = Math.random() * 10 - 1;
        cube[cubeCount].position.z = Math.random() * 6 - 1;
        cube[cubeCount].rotation.x = Math.random() * 2 * Math.PI;
        cube[cubeCount].rotation.y = Math.random() * 2 * Math.PI;
        cube[cubeCount].rotation.z = Math.random() * 2 * Math.PI;
        cube[cubeCount].userData = record.fields;

        //source code 
        //https://stackoverflow.com/questions/31229214/manipulate-objects-in-the-browser-with-three-js-using-the-mouse
        // cube[cubeCount].userData.scaleUp = function(h) {
        //           if (h.userData.scaleDownTween) h.userData.scaleDownTween.stop();
        //           let initScale = h.scale.clone();
        //           let finalScale = new THREE.Vector3().setScalar(2);
        //           h.userData.scaleUpTween = new TWEEN.Tween(initScale).to(finalScale, 500).onUpdate(function(obj) {
        //             h.scale.copy(obj)
        //           }).start();
        //         }
        //         cube[cubeCount].scaleDown = function(h) {
        //           if (h.userData.scaleUpTween) h.userData.scaleUpTween.stop();
        //           let initScale = h.scale.clone();
        //           let finalScale = new THREE.Vector3().setScalar(1);
        //           h.userData.scaleUpTween = new TWEEN.Tween(initScale).to(finalScale, 500).onUpdate(function(obj) {
        //             h.scale.copy(obj)
        //           }).start();
        //         }
        scene.add(cube[cubeCount]);
      });
      fetchNextPage();
    },
    function done(err) {
      if (err) {
        console.error(err);
        return;
      }
    }
  );

function animate() {
  requestAnimationFrame(animate);
  var timer = 0.0001 * Date.now();
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      INTERSECTED = intersects[0].object;
      modal_container.classList.add("show");
      //if (INTERSECTED) INTERSECTED.userData.scaleDown(INTERSECTED);
     // INTERSECTED.userData.scaleUp(INTERSECTED);
      modal_title.innerHTML = INTERSECTED.userData.Title;
      modal_name.innerHTML = INTERSECTED.userData.Country;
      modal_desc.innerHTML = INTERSECTED.userData.Description;
      modal_img.src = INTERSECTED.userData.Img;
    }
  } else {
   // if (INTERSECTED) INTERSECTED.userData.scaleDown(INTERSECTED);
    INTERSECTED = null;
  }

  for (var i = 1, il = cube.length; i < il; i++) {
    cube[i].position.x = 8 * Math.cos(timer + i);
    cube[i].position.y = 5 * Math.sin(timer + i * 1.5);
    cube[i].position.z = 5 * Math.tan(timer + i * 1.1);
  }
  controls.update();
  TWEEN.update();
  renderer.render(scene, camera);
}

initScene();
animate();

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

close.addEventListener("click", () => {
  modal_container.classList.remove("show");
});
