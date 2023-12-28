import * as THREE from "three";

import { cylinderMesh, linspace, sleep } from "./utils";


const pointGeometry = new THREE.SphereGeometry( 0.4, 32, 16 ); 
const pointMaterial = color => new THREE.MeshBasicMaterial({ color: color }); 


export async function drawTrajectory(
    fn: (x:number, y: number, z:number) => [number, number, number],
    initial: [number, number, number],
    maxTime: number,
    timeGrain: number,
    scene: THREE.Scene
) {
    const points:THREE.Vector3[] = [];
    let [xa, ya, za] = initial;
    let xb: number, yb: number, zb: number;
    const lines:THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[]= []
    for (let t=0; t < maxTime; t+=timeGrain) {
        const [dx, dy, dz] = fn(xa, ya, za);
        [xb, yb, zb] = [
            xa+dx*timeGrain, 
            ya+dy*timeGrain, 
            za+dz*timeGrain 
        ]
        console.log(xb, yb, zb)
        const sphere = new THREE.Mesh( pointGeometry, pointMaterial('black') ); 
        sphere.position.set(xb, yb, zb);
        // scene.add(sphere);
        const line = cylinderMesh(
            new THREE.Vector3(xa, ya, za),
            new THREE.Vector3(xb, yb, zb),
            0.1
        )
        scene.add(line);
        lines.push(line)
        xa = xb;
        ya = yb;
        za = zb;
        await sleep(.01);
    }
    return lines
}


export function drawPhasePlot(
    fn: (x:number, y: number, z:number) => [number, number, number],
    xBounds: [number, number],
    yBounds: [number, number],
    zBounds: [number, number],
    scene
) {

    const xlin = linspace(xBounds[0], xBounds[1], 12);
    const ylin = linspace(yBounds[0], yBounds[1], 12);
    const zlin = linspace(zBounds[0], zBounds[1], 12);

    const arrows:THREE.ArrowHelper[] = [];
    for (let i = 0; i < xlin.length; i++) {
        for (let j = 0; j < ylin.length; j++) {
            for (let k = 0; k < zlin.length; k++) {
                const [x,y,z] = [xlin[i], ylin[j], zlin[k]]
                const [dx, dy, dz] = fn(x, y, z);
                const dir = new THREE.Vector3( dx, dy, dz );
                dir.normalize();
                const origin = new THREE.Vector3( x, y, z );
                const length =1
                const hex = "gray";
                const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
                scene.add( arrowHelper );
                arrows.push(arrowHelper);
            }
        }
    }
    return arrows;

}