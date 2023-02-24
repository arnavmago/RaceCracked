import * as THREE from 'three';
const vehicleColors = [0x003366, 0xb0e0e6, 0xc6e2ff, 0x800080, 0x20b2aa, 0x0e2f44, 0x008000, 0x088da5, 0x0a75ad]

export default function Car(McQueen) {
    const car = new THREE.Group();
    const carFrontTexture = getCarFrontTexture();
    const carBackTexture = getCarFrontTexture();
    const carLeftTexture = getCarSideTexture();
    const carRightTexture = getCarSideTexture();

    const backWheel = Wheel();
    backWheel.position.x = -18;
    car.add(backWheel);

    const frontWheel = Wheel();
    frontWheel.position.x = 18;
    car.add(frontWheel);

    if (McQueen) {
        const main = new THREE.Mesh(
            new THREE.BoxGeometry(60, 30, 15),
            new THREE.MeshLambertMaterial({ color: 0xC33332 })
        )
        main.position.z = 12;
        car.add(main);
    }
    else {
        const main = new THREE.Mesh(
            new THREE.BoxGeometry(60, 30, 15),
            new THREE.MeshLambertMaterial({ color: random(vehicleColors) })
        )
        main.position.z = 12;
        car.add(main);
    }

    carFrontTexture.center = new THREE.Vector2(0.5, 0.5);
    carFrontTexture.rotation = Math.PI / 2;

    carBackTexture.center = new THREE.Vector2(0.5, 0.5);
    carBackTexture.rotation = -Math.PI / 2;

    carLeftTexture.flipY = false;

    const chasis = new THREE.Mesh(new THREE.BoxGeometry(33, 24, 12), [
        new THREE.MeshLambertMaterial({ map: carFrontTexture }),
        new THREE.MeshLambertMaterial({ map: carBackTexture }),
        new THREE.MeshLambertMaterial({ map: carLeftTexture }),
        new THREE.MeshLambertMaterial({ map: carRightTexture }),
        new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
        new THREE.MeshLambertMaterial({ color: 0xffffff })  //bottom
    ]);
    chasis.position.z = 25.5;
    chasis.position.x = -6;
    car.add(chasis);

    return car;
}

function Wheel() {
    const wheel = new THREE.Mesh(
        new THREE.BoxGeometry(12, 33, 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );

    wheel.position.z = 6;

    return wheel;
}

function random(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getCarFrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 24);

    return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);

    return new THREE.CanvasTexture(canvas);
}