import * as THREE from 'three';

const trackRadius = 725;
const trackWidth = 200;
const innerTrackRadius = trackRadius - trackWidth;
const outerTrackRadius = trackRadius + trackWidth;

export default function renderMap(mapWidth, mapHeight, scene) {

    const lineMarkingsTexture = getLineMarkings(mapWidth, mapHeight);

    const planeGeometry = new THREE.PlaneGeometry(mapWidth, mapHeight);
    const planeMaterial = new THREE.MeshLambertMaterial({
        map: lineMarkingsTexture
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    const islandMiddle = getMiddleIsland();
    const outerField = getOuterField(mapWidth, mapHeight);

    const FieldGeometry = new THREE.ExtrudeGeometry(
        [islandMiddle, outerField],
        { depth: 6, bevelEnabled: false }
    );

    const FieldMesh = new THREE.Mesh(FieldGeometry, [
        new THREE.MeshLambertMaterial({ color: 0x67c240 }),
        new THREE.MeshLambertMaterial({ color: 0x23311c }),
    ]);

    scene.add(FieldMesh);
}

function getLineMarkings(mapWidth, mapHeight) {
    const canvas = document.createElement('canvas');
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    const context = canvas.getContext("2d");

    context.fillStyle = "#546e90";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.lineWidth = 2;
    context.strokeStyle = "#e0ffff";
    context.setLineDash([10, 14]);

    // left circle
    context.beginPath();
    context.arc(
        mapWidth / 2,
        mapHeight / 2,
        trackRadius,
        0,
        Math.PI * 2
    );
    context.stroke();

    return new THREE.CanvasTexture(canvas);
}

function getMiddleIsland() {
    const islandMiddle = new THREE.Shape();

    islandMiddle.absarc(
        0,
        0,
        innerTrackRadius,
        0,
        Math.PI,
        true
    );

    islandMiddle.absarc(
        0,
        0,
        innerTrackRadius,
        0,
        Math.PI * 2,
        true
    );

    return islandMiddle;
}

function getOuterField(mapWidth, mapHeight) {
    const field = new THREE.Shape();

    field.moveTo(-mapWidth / 2, -mapHeight / 2);
    field.lineTo(0, -mapHeight / 2);

    field.absarc(
        0,
        0,
        outerTrackRadius,
        -Math.PI / 2,
        3 * Math.PI / 2,
        true
    );

    field.lineTo(0, -mapHeight / 2);
    field.lineTo(mapWidth / 2, -mapHeight / 2);
    field.lineTo(mapWidth / 2, mapHeight / 2);
    field.lineTo(-mapWidth / 2, mapHeight / 2);

    return field;
}

