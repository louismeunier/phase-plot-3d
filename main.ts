import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { drawAxes } from './utils';
import { drawPhasePlot, drawTrajectory } from './math';


// import Stats from 'three/addons/libs/stats.module.js';


let camera, scene, renderer, stats, controls;

let xb:[number, number] = [-25, 25],
yb:[number, number] = [-25, 25],
zb:[number, number] = [0, 25]

init();
animate();

// ? Create scene and torus, setup event listeners for panels
function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 75, 40, 75 );


    // !
    // const ambientLight = new THREE.AmbientLight( 0xcccccc, 1 );
    // scene.add( ambientLight );
    // const pointLight = new THREE.PointLight( 0xffffff, 2, 0, 0 );
    // camera.add( pointLight );

    scene.add( camera );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 10;
    controls.maxDistance = 500;
    controls.maxPolarAngle = 2*Math.PI ;
    controls.enablePan = true;

    window.addEventListener( 'resize', onWindowResize );

    // ? utils
    const axesHelper = new THREE.AxesHelper( 10 );
    // scene.add( axesHelper );


    const s = 10,
    b = 8/3,
    r = 28;

    const systems = {
        "lorenz":  (x:number, y:number, z:number):[number, number, number] => [
            s*(y-x),
            x*(r-z)-y,
            x*y-b*z
        ],
        "rossler": (x:number, y:number, z:number):[number, number, number] => [
            -1*(y+z),
            x+0.2*y,
            0.2+x*z-8*z
        ],
        // "linear": (x:number, y:number, z:number):[number,number,number] => [
        //     -x^2+z,
        //     5*y-x,
        //     z+4*y-8*x
        // ]
    }


    // const duffing = (x:number, y:number, z:number):[number,number,number] => [
    //     y,
    //     -4*y-x+x^3-Math.cos(z),
    //     1
    // ]

    // const abc = (x:number, y:number, z:number):[number,number,number] => [
    //     2*Math.sin(z)+5*Math.cos(y),
    //     0.5*Math.sin(x)+2*Math.cos(z),
    //     5*Math.sin(y)+0.5*Math.cos(x)
    // ]

    let trajectoryLines= [];
    let func = systems["lorenz"];

    document.getElementById("system")?.addEventListener("input", e => {
        trajectoryLines.forEach(l => scene.remove(l))
        func = systems[e.target.value];

    })

    
    document.getElementById("draw-trajectory")?.addEventListener("click", async e => {
        trajectoryLines = await drawTrajectory(func, [1,1,1], 100, 0.005, scene);
    })


    const inputs = document.querySelectorAll(".control input[type='range']");
    console.log(inputs)

    let axes = drawAxes(xb, yb, zb, scene);
    let arrows = drawPhasePlot(
        func,
        xb,
        yb,
        zb,
        scene
    )

    document.getElementById("show-phase")?.addEventListener("click", e => {
        if (arrows.length == 0) {
            arrows = drawPhasePlot(func,xb,yb,zb,scene);
         } else {
            arrows.forEach(a=>scene.remove(a));
            arrows.length = 0;
         } 
    })
    
    inputs.forEach(input => {
        input.addEventListener("input", e => {
            [
                xb, xb, yb, yb, zb, zb
            ][([...inputs].indexOf(input))][
                input.id.slice(1)=="min" ? 0 : 1
            ] = parseFloat(e.target.value);
            axes.forEach(a => scene.remove(a));
            arrows.forEach(a => scene.remove(a));
            axes = drawAxes(xb, yb, zb, scene);
            arrows = drawPhasePlot(func, xb, yb, zb, scene)
        })
    })

    
   
    // drawTrajectory(
    //     lorenz,
    //     [2,1,1],
    //     100,
    //     .01,
    //     scene
    // )
   
    
}




function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    // camera.lookAt( scene.position );
    renderer.render( scene, camera );
    controls.update()
    // scene.background = new THREE.Color( "#eae2d7" )
    scene.background = new THREE.Color( "black" )
}
