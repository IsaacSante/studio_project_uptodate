import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
var modal_container = document.getElementById("modal-container");
var modal_title = document.getElementById("modal-title");
var modal_desc = document.getElementById("modal-desc"); 
var modal_img = document.getElementById("modal-img"); 
var modal_name = document.getElementById("modal-name"); 
var close = document.getElementById("close");
var cubeCount, material, raycaster;
var cube = [];


// function closeDiv()
// {
//     var Temp = document.getElementById("paperuploaded")
//     if (Temp != null)
//         Temp.style.display = "none";
// }

// window.setTimeout("closeDiv();", 5000);


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor( 0xffffff, 0);
document.body.appendChild(renderer.domElement);
const color = 0xffffff;
const intensity = 1.3;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

var light1 = new THREE.PointLight(0xffffff, 4, 50);
light1.position.set(0,300,500);
scene.add(light1)

var geometry = new THREE.BoxBufferGeometry( 0.5, 0.5, 0.5 );
camera.position.z = 5;

var controls = new OrbitControls(camera, renderer.domElement);
controls.update()
controls.minDistance = 1;
controls.maxDistance = 50;
controls.enableDamping = true;
controls.dampingFactor = 0.2;

var mouse = new THREE.Vector2(), INTERSECTED;
raycaster = new THREE.Raycaster();
document.addEventListener("mousemove", onDocumentMouseMove, false);

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

var Airtable = require("airtable");
var base = new Airtable({ apiKey: "keyMKnZBFsdFtC0UX" }).base(
  'appdpqaDAEWlYBfVv'
);

cubeCount = 0;
base("Table 1")
  .select({
    maxRecords: 100,
    view: "Grid view",
  })
  .eachPage(
    function page(records, fetchNextPage) {
      records.forEach(function (record) {
        cubeCount++;
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
      modal_title.innerHTML = INTERSECTED.userData.artid;
      modal_name.innerHTML = INTERSECTED.userData.aname; 
      modal_desc.innerHTML = INTERSECTED.userData.artdes;
      modal_img.src = INTERSECTED.userData.manimg;
      INTERSECTED.scale.x 
    }
  } else {
    INTERSECTED = null;
   }

 for (var i = 1, il = cube.length; i < il; i++) {
    cube[i].position.x = 8 * Math.cos(timer + i) 
    cube[i].position.y = 5 * Math.sin(timer + i * 1.5)
    cube[i].position.z = 5 * Math.tan(timer + i *1.1) 
  }
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

close.addEventListener("click", () => {
  modal_container.classList.remove("show");
});


