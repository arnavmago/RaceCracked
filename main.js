import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Car from './car';
import renderMap from './map';
import './index.css'

const app = document.getElementById('app');
const dashboard = document.getElementById('dashboard');
const start = document.getElementById('start-screen');
const end = document.getElementById('game-over');
const myScore = document.getElementById('myscore');
const mileageDash = document.getElementById('dashboard-2');
const leaderboardDisplay = document.getElementById('leaderboard');
leaderboardDisplay.innerText = "\n\n\n"

let ready = true;
let angleMoved;
let score;
let scoretemp
let health;
let Carfuel = 100
let time = 0;
let otherVehicles = [];
let lastTimeStamp;
const angleInitial = Math.PI;
const camAngleInitial = Math.PI * 8 / 7;
const FPVAngleInitial = Math.PI * 7 / 10;
let cameraAngle;
let FPVAngle
let accelerate = false;
let decelerate = false;
let right = false;
let left = false;
let camState = 0
let initial = true
let fueldist = 0
let mileage = 420;
let flag = 1

let leaderboard = [
  { name: 'HasNeverTouchedGrass', score: 100 },
  { name: 'HasOnlyOneFriend', score: 50 },
  { name: 'HasASocialLife', score: 1 }
]

let speed = 0;
const loader = new GLTFLoader();

const trackRadius = 725;
const trackWidth = 200;
const outerRadius = trackRadius + trackWidth;
const innerRadius = trackRadius - trackWidth;
let CarX = -trackRadius;
let CarY = 0;
const scene = new THREE.Scene();

const car = Car(1);
scene.add(car);

// setting up the lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directLight = new THREE.DirectionalLight(0xffffff, 0.6);
directLight.position.set(100, -300, 400);
scene.add(directLight)

// setting up the camera

const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 4000;
const cameraHeight = cameraWidth / aspectRatio;
const insetHeight = window.innerHeight / 4
const insetWidth = window.innerWidth / 4

const camera = new THREE.OrthographicCamera(
  cameraWidth / -2,   //left
  cameraWidth / 2,    //right
  cameraHeight / 2,   //top
  cameraHeight / -2,  //bottom
  0,                  // near plane
  1000                // far plane
);

const minimapCamera = new THREE.OrthographicCamera(
  cameraWidth / -2,   //left
  cameraWidth / 2,    //right
  cameraHeight / 2,   //top
  cameraHeight / -2,  //bottom
  0,                  // near plane
  1000                // far plane
);

camera.position.set(0, 0, 200)
camera.lookAt(0, 0, 0)

minimapCamera.position.set(0, 0, 200)
minimapCamera.lookAt(0, 0, 0)

const followCamera = new THREE.PerspectiveCamera(
  75,
  aspectRatio,
  0.1,
  1000000
);

const FPVcamera = new THREE.PerspectiveCamera(
  75,
  aspectRatio,
  0.1,
  1000000
);

let lookX = Math.cos(angleInitial) * (trackRadius)
let lookY = Math.sin(angleInitial) * (trackRadius)
followCamera.position.x = Math.cos(camAngleInitial) * (trackRadius)
followCamera.position.y = Math.sin(camAngleInitial) * (trackRadius)
followCamera.position.z = 200
followCamera.rotation.z = camAngleInitial
followCamera.up.set(0, 0, 1)
followCamera.lookAt(lookX, lookY, car.position.z)

let FPVx = Math.cos(FPVAngleInitial) * (trackRadius)
let FPVy = Math.sin(FPVAngleInitial) * (trackRadius)
FPVcamera.position.x = car.position.x
FPVcamera.position.y = car.position.y
FPVcamera.position.z = 50
FPVcamera.rotation.z = angleInitial
FPVcamera.up.set(0, 0, 1)
FPVcamera.lookAt(FPVx, FPVy, car.position.z)

for (let i = 0; i < 10; i++) {
  loader.load('./textures/low_poly_building/scene.gltf', (gltf) => {
    const house = gltf.scene
    house.scale.set(100, 100, 100)
    house.rotateX(Math.PI / 2)
    house.rotateY(Math.PI)
    let houseX = (outerRadius + 700) * Math.cos(Math.PI * (i / 5))
    let houseY = (outerRadius + 700) * Math.sin(Math.PI * (i / 5))
    house.position.set(houseX, houseY, 0)
    house.rotation.y = -Math.PI * (i / 5)
    scene.add(house)
  })
}

loader.load('./textures/G/scene.gltf', (gltf) => {
  const logo = gltf.scene
  logo.rotateX(Math.PI / 2)
  logo.scale.set(20, 20, 20)
  logo.position.set(0, 0, 165)
  scene.add(logo)
})

for (let a = 1; a <= 3; a++) {
  for (let i = 0; i < 60; i++) {
    loader.load('./textures/people/scene.gltf', (gltf) => {
      const person = gltf.scene
      person.rotateX(Math.PI / 2)
      person.rotateY(Math.PI)
      person.scale.set(36, 36, 36)
      let personX = (outerRadius + 100 * a) * Math.cos(Math.PI * (i / 30))
      let personY = (outerRadius + 100 * a) * Math.sin(Math.PI * (i / 30))
      person.position.set(personX, personY, 0)
      person.rotation.y = -Math.PI * (i / 30)
      scene.add(person)
    })
  }
}

for (let i = 0; i < 50; i++) {
  loader.load('./textures/barricade/scene.gltf', (gltf) => {
    const barricade = gltf.scene
    barricade.rotateX(Math.PI / 2)
    barricade.rotateY(Math.PI)
    barricade.scale.set(50, 50, 50)
    let BarricadeX = outerRadius * Math.cos(Math.PI * (i / 25))
    let BarricadeY = outerRadius * Math.sin(Math.PI * (i / 25))
    barricade.position.set(BarricadeX, BarricadeY, 10)
    barricade.rotation.y = -Math.PI * (i / 25) + Math.PI / 2
    scene.add(barricade)
  })
}

for (let i = 0; i < 28; i++) {
  loader.load('./textures/barricade/scene.gltf', (gltf) => {
    const barricade = gltf.scene
    barricade.rotateX(Math.PI / 2)
    barricade.rotateY(Math.PI)
    barricade.scale.set(50, 50, 50)
    let BarricadeX = (innerRadius - 10) * Math.cos(Math.PI * (i / 14))
    let BarricadeY = (innerRadius - 10) * Math.sin(Math.PI * (i / 14))
    barricade.position.set(BarricadeX, BarricadeY, 10)
    barricade.rotation.y = -Math.PI * (i / 14) + Math.PI / 2
    scene.add(barricade)
  })
}

var fuelCan;
loader.load('./textures/fuel_can/scene.gltf', (gltf) => {
  fuelCan = gltf.scene
  fuelCan.rotateX(Math.PI / 2)
  fuelCan.scale.set(1, 1, 1)
  let rand = Math.random() * 2
  let FuelX = (innerRadius + trackWidth * rand) * Math.cos(Math.PI * rand)
  let FuelY = (innerRadius + trackWidth * rand) * Math.sin(Math.PI * rand)
  fuelCan.position.set(FuelX, FuelY, 10)
  scene.add(fuelCan)
})

renderMap(cameraWidth, cameraHeight * 2, scene);

// setting up the renderer

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

app.appendChild(renderer.domElement);


reset();

// functions for implementing game logic

function reset() {
  if (!ready) renderer.setAnimationLoop(animation)
  flag = 1
  leaderboardDisplay.innerText = "\n\n\n"
  leaderboard = [
    { name: 'HasNeverTouchedGrass', score: 100 },
    { name: 'HasOnlyOneFriend', score: 50 },
    { name: 'HasASocialLife', score: 1 }
  ]
  CarX = -trackRadius;
  speed = 0
  cameraAngle = 0;
  angleMoved = 0;
  health = 100
  Carfuel = 100
  FPVAngle = 0
  time = 0
  movePlayerCar(0);
  myScore.innerText = "Your Score:" + score
  score = 0;
  dashboard.innerText = "Score:" + score + " Health:" + health + " Fuel:" + Carfuel + " Time:" + time;
  mileageDash.innerText = "Next Fuel Can:" + fueldist + " Mileage:" + mileage
  lastTimeStamp = undefined;

  otherVehicles.forEach((vehicle) => {
    scene.remove(vehicle.mesh);
  });
  otherVehicles = [];
  initial = true

  renderer.render(scene, camera);
  end.style.zIndex = 0
  ready = true;
}

function endGame() {
  leaderboard.push({ name: 'You', score: score })
  leaderboard.sort((a, b) => b.score - a.score)
  for (const player of leaderboard) {
    leaderboardDisplay.innerText += `${player.name}: ${player.score}\n\n`
  }
  end.style.zIndex = 5
  renderer.setAnimationLoop(null)
  ready = false
}

function StartGame() {
  if (ready) {
    ready = false;
    renderer.setAnimationLoop(animation);
    start.style.zIndex = 0
  }
}

window.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp" || event.key === "W" || event.key === "w") {
    StartGame();
    accelerate = true;
    return;
  }

  if (event.key === "ArrowDown" || event.key === "S" || event.key === "s") {
    decelerate = true;
    return;
  }

  if (event.key === "R" || event.key === "r") {
    reset();
  }

  if (event.key === "ArrowRight" || event.key === "D" || event.key === "d") {
    right = true;
    return;
  }

  if (event.key === "ArrowLeft" || event.key === "A" || event.key === "a") {
    left = true;
    return;
  }

  if (event.key === "v" || event.key === "V") {
    camState++;
  }
});

window.addEventListener("keyup", function (event) {
  if (event.key === "ArrowUp" || event.key === "W" || event.key === "w") {
    StartGame();
    accelerate = false;
    return;
  }

  if (event.key === "ArrowDown" || event.key === "S" || event.key === "s") {
    decelerate = false;
    return;
  }

  if (event.key === "ArrowRight" || event.key === "D" || event.key === "d") {
    right = false;
    return;
  }

  if (event.key === "ArrowLeft" || event.key === "A" || event.key === "a") {
    left = false;
    return;
  }
});

function animation(timestamp) {
  if (!lastTimeStamp) {
    lastTimeStamp = timestamp;
    return;
  }
  time += 0.045;
  if (accelerate || decelerate) Carfuel -= 0.3;
  else Carfuel -= 0.05

  const timeDelta = timestamp - lastTimeStamp;

  movePlayerCar(timeDelta);

  const laps = Math.floor(Math.abs(angleMoved) / (Math.PI * 2))

  if (laps !== score) {
    score = laps;
  }

  dashboard.innerText = "Score:" + score + " Health:" + health + " Fuel:" + Math.floor(Carfuel) + " Time:" + Math.floor(time);
  mileageDash.innerText = "Next Fuel Can:" + Math.floor(fueldist / 10) + " Mileage:" + mileage
  myScore.innerText = "Your Score:" + score

  if (health <= 0 || Carfuel <= 0)
    endGame()

  moveOtherVehicles(timeDelta);

  hitDetection();

  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

  if (camState % 2 === 1)
    renderer.render(scene, FPVcamera);
  else
    renderer.render(scene, followCamera);

  renderer.setScissorTest(true);
  renderer.setScissor(16, window.innerHeight - insetHeight - 16, insetWidth, insetHeight);
  renderer.setViewport(16, window.innerHeight - insetHeight - 16, insetWidth, insetHeight);
  renderer.render(scene, minimapCamera)
  renderer.setScissorTest(false);

  if (initial) {
    for (let i = 0; i < 3; i++) {
      addVehicle()
    }
    initial = false
  }

  else if (otherVehicles.length < laps) addVehicle();

  lastTimeStamp = timestamp;
}

function movePlayerCar(timeDelta) {
  const playerSpeed = getPlayerSpeed();
  angleMoved -= playerSpeed * timeDelta;
  cameraAngle -= playerSpeed * timeDelta;
  FPVAngle -= playerSpeed * timeDelta;
  const absoluteDistance = Math.sqrt(CarX * CarX + CarY * CarY);

  const totalPlayerAngle = angleInitial + angleMoved;
  const totalCamAngle = camAngleInitial + cameraAngle;
  const totalFPVangle = FPVAngleInitial + FPVAngle;

  if (right && (accelerate || decelerate) && CarX < -550) {
    CarX += 8
  }
  else if (right && (accelerate || decelerate)) {
    CarX -= 3
    health--
    if (speed > 0) speed -= 0.0002
    else speed += 0.0002
  }

  if (left && (accelerate || decelerate) && CarX > -900) {
    CarX -= 8
  }
  else if (left && (accelerate || decelerate)) {
    CarX += 3
    health--
    if (speed > 0) speed -= 0.0002
    else speed += 0.0002
  }

  const playerX = Math.cos(totalPlayerAngle) * absoluteDistance;
  const playerY = Math.sin(totalPlayerAngle) * absoluteDistance;
  car.position.x = playerX;
  car.position.y = playerY;

  const FPVX = Math.cos(totalFPVangle) * absoluteDistance;
  const FPVY = Math.sin(totalFPVangle) * absoluteDistance;
  FPVcamera.position.x = playerX
  FPVcamera.position.y = playerY

  followCamera.position.x = Math.cos(totalCamAngle) * trackRadius;
  followCamera.position.y = Math.sin(totalCamAngle) * trackRadius;
  const camX = Math.cos(totalPlayerAngle) * trackRadius;
  const camY = Math.sin(totalPlayerAngle) * trackRadius;

  car.rotation.z = totalPlayerAngle - Math.PI / 2;
  FPVcamera.rotation.z = totalPlayerAngle - Math.PI / 2;
  followCamera.rotation.z = totalCamAngle - Math.PI / 2;

  followCamera.lookAt(camX, camY, car.position.z);
  FPVcamera.lookAt(FPVX, FPVY, car.position.z)
}

function getPlayerSpeed() {
  if (accelerate) {
    if (speed < 0.0015)
      speed += 0.0001;
    else
      speed = 0.0015
    return speed;
  }
  if (decelerate) {
    if (speed > -0.0015)
      speed -= 0.0001
    else
      speed = -0.0015
    return speed;
  }
  else if (!accelerate && !decelerate) {
    if (speed > 0.0001)
      speed -= 0.0001
    else if (speed < -0.0001)
      speed += 0.0001
    else
      return 0
    return speed;
  }
}

function addVehicle() {
  const mesh = Car(0);

  const otherX = -trackRadius + Math.floor(Math.random() * (361) - 180);
  const otherY = 0;
  const angle = Math.PI / 2;
  const absOtherDistance = Math.sqrt(otherX * otherX + otherY * otherY);
  const speed = getVehicleSpeed();
  scene.add(mesh);

  otherVehicles.push({ mesh: mesh, speed: speed, abs: absOtherDistance, angle: angle });
}

function getVehicleSpeed() {
  return 1 + Math.random() * 0.2;
}

function moveOtherVehicles(timeDelta) {
  otherVehicles.forEach((vehicle) => {
    vehicle.angle -= 0.001 * timeDelta * vehicle.speed;

    const vehicleX = Math.cos(vehicle.angle) * vehicle.abs;
    const vehicleY = Math.sin(vehicle.angle) * vehicle.abs;

    const rotation = vehicle.angle - Math.PI / 2;

    vehicle.mesh.position.x = vehicleX;
    vehicle.mesh.position.y = vehicleY;
    vehicle.mesh.rotation.z = rotation;
  });
}

function hitZone(center, angle, speed, distance) {
  const directionAngle = angle + speed > 0 ? -Math.PI / 2 : Math.PI / 2;
  return {
    x: center.x + Math.cos(directionAngle) * distance,
    y: center.y + Math.sin(directionAngle) * distance
  };
}

function staticHitZone(center) {
  return {
    x: center.x,
    y: center.y
  }
}

function hitDetection() {
  const carFront = hitZone(car.position, angleInitial + angleMoved, speed, 14);
  const carBack = hitZone(car.position, angleInitial + angleMoved, speed, -14);

  if (fuelCan) {
    const fuelcan = staticHitZone(fuelCan.position)

    fueldist = dist(carFront, fuelcan)
    if (fueldist < 40 || dist(carBack, fuelCan) < 30) {
      Carfuel = 100
      let rand = Math.random() * 2
      let FuelX = (innerRadius + trackWidth * rand) * Math.cos(Math.PI * rand)
      let FuelY = (innerRadius + trackWidth * rand) * Math.sin(Math.PI * rand)
      fuelCan.position.set(FuelX, FuelY, 10)
    }
  }

  for (let vehicle of otherVehicles) {
    let hit = 0
    const enemyFront = hitZone(vehicle.mesh.position, vehicle.angle, vehicle.speed, 14);
    const enemyBack = hitZone(vehicle.mesh.position, vehicle.angle, vehicle.speed, -14);

    if (
      dist(carFront, enemyFront) < 30 ||
      dist(carFront, enemyBack) < 25 ||
      dist(carBack, enemyFront) < 25 ||
      dist(carBack, enemyBack) < 30)
      hit = 1;

    if (hit) {
      if (speed > 0.0001) {
        speed -= 0.0015
        health -= 10
      }
      else if (speed < -0.0001) {
        speed += 0.0015
        health -= 10
      }
    }
  }
}

function dist(a, b) {
  const h = b.x - a.x;
  const v = b.y - a.y;
  return Math.sqrt(h ** 2 + v ** 2);
}
