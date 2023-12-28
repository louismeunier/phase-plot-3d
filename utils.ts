import * as THREE from 'three';

export async function sleep(t: number) {return new Promise(r => setTimeout(r, t))}

export function cylinderMesh ( pointX, pointY, radius )
{
    /* edge from X to Y */
    var direction = new THREE.Vector3().subVectors( pointY, pointX );
    var orientation = new THREE.Matrix4();
    /* THREE.Object3D().up (=Y) default orientation for all objects */
    orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
    /* rotation around axis X by -90 degrees 
     * matches the default orientation Y 
     * with the orientation of looking Z */
    orientation.multiply(new THREE.Matrix4(1,0,0,0,
                                            0,0,1,0, 
                                            0,-1,0,0,
                                            0,0,0,1));

    /* cylinder: radiusAtTop, radiusAtBottom, 
        height, radiusSegments, heightSegments */
    var edgeGeometry = new THREE.CylinderGeometry( radius, radius, direction.length(), 4, 1);
    var edge = new THREE.Mesh( edgeGeometry, 
            new THREE.MeshBasicMaterial( { color: "#a29eff" } ) );

    edge.applyMatrix4(orientation)
    const newPosition = new THREE.Vector3().addVectors( pointX, direction.multiplyScalar(0.5) )
    edge.position.set(newPosition.x, newPosition.y, newPosition.z);
    return edge;
}


export function drawAxes(
    xBounds: [number, number],
    yBounds: [number, number],
    zBounds: [number, number],
    scene: THREE.Scene
) {
    const origin = new THREE.Vector3(0,0,0);
    const x1 = new THREE.ArrowHelper(
        new THREE.Vector3(xBounds[0], 0, 0),
        origin,
        Math.abs(xBounds[0]),
        "white"
    );
    const x2 = new THREE.ArrowHelper(
        new THREE.Vector3(xBounds[1], 0, 0),
        origin,
        Math.abs(xBounds[1]),
        "white"
    );
    const y1 = new THREE.ArrowHelper(
        new THREE.Vector3(0, xBounds[0], 0),
        origin,
        Math.abs(yBounds[0]),
        "white"
    );
    const y2 = new THREE.ArrowHelper(
        new THREE.Vector3(0, xBounds[1], 0),
        origin,
        Math.abs(yBounds[1]),
        "white"
    );
    const z1 = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, xBounds[0]),
        origin,
        Math.abs(zBounds[0]),
        "white"
    );
    const z2 = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, xBounds[1]),
        origin,
        Math.abs(zBounds[1]),
        "white"
    );
    scene.add(x1);
    scene.add(x2);
    scene.add(y1);
    scene.add(y2);
    scene.add(z1);
    scene.add(z2);
    return [x1, x2, y1, y2, z1, z2]
}

export function linspace(min:number, max:number, num:number) {
    let i = 1;
    const space:number[] = [];
    while (i <= num) {
        space.push(min+i*Math.abs(max-min)/num);
        i++;
    }
    return space;
}