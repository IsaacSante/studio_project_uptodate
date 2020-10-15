import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";

var countryListNode, totalnum, textnode, cubeCount, material, raycaster;
var cube = []; 
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const color = 0xffffff;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

var geometry = new THREE.SphereBufferGeometry( 0.2, 32, 16 );
camera.position.z = 5;

var controls = new OrbitControls( camera, renderer.domElement );
  controls.update();

 controls.minDistance = 2;
 controls.maxDistance = 40;
 controls.enableDamping = true;
 controls.dampingFactor = 0.2;


 var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;
 raycaster = new THREE.Raycaster();
 document.addEventListener( 'mousemove', onDocumentMouseMove, false );

 function onDocumentMouseMove( event ) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

var Airtable = require("airtable");
var base = new Airtable({ apiKey: "keyMKnZBFsdFtC0UX" }).base(
  "app7x77PDdblrFWMR"
);

cubeCount = 0;

base("Table 1")
  .select({
    maxRecords: 52,
    view: "Grid view",
    sort: [{ field: "Total", direction: "desc" }],
    //  filterByFormula: "IF({Mostly collected during colonial period},'True')",
  })
  .eachPage(
    function page(records, fetchNextPage) {
      records.forEach(function (record) {
        var item = document.createElement("li");
       // console.log(record);
        countryListNode = record.get("Country");
        totalnum = record.get("Total");
        textnode = document.createTextNode(
          countryListNode + ".............." + totalnum
        );
        item.appendChild(textnode);
        document.getElementById("results").appendChild(item);
        item.style.listStyle = "none";
        cubeCount ++ ;
        // if (record.fields.Mostly collected during colonial period){
        //   console.log('this is very true');
        // }
        // console.log(cubeCount)
        material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
         cube[cubeCount] = new THREE.Mesh(geometry, material);
         cube[cubeCount].position.x = Math.random() * 2 - 1;
         cube[cubeCount].position.y = Math.random() * 10 - 1;
         cube[cubeCount].position.z = Math.random() * 6 - 1;
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
     for ( var i = 1, il = cube.length; i < il; i ++ ) {
         cube[i].position.x = 5 * Math.cos( timer + i );
         cube[i].position.y = 5 * Math.sin( timer + i * 1.1  ); 
     }

        raycaster.setFromCamera( mouse, camera );
				var intersects = raycaster.intersectObjects( scene.children );

				if ( intersects.length > 0 ) {

					if ( INTERSECTED != intersects[ 0 ].object ) {
					//	if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            INTERSECTED = intersects[ 0 ].object;
            console.log(INTERSECTED.userData);
						// INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
						//INTERSECTED.material.emissive.setHex( 0xff0000 );
					}

				} else {
					//if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
					INTERSECTED = null;
				}

    controls.update();
    renderer.render(scene, camera);
  }
  animate();