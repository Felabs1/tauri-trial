import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "@babylonjs/loaders";
import * as CANNON from "cannon";
import {
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Color3,
  SceneLoader,
  AbstractMesh,
  CannonJSPlugin,
  BabylonFileLoaderConfiguration,
} from "@babylonjs/core";
import SceneComponent from "./SceneComponent";
import "./App.css";

let box;
BabylonFileLoaderConfiguration.LoaderInjectedPhysicsEngine = CANNON;
window.CANNON = CANNON;

const onSceneReady = async (scene) => {
  // This creates and positions a free camera (non-mesh)
  // const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
  const camera = new FreeCamera("FreeCamera", new Vector3(0, 2, 5), scene);

  // Our built-in 'box' shape.
  // box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  // // Move the box upward 1/2 its height
  // box.position.y = 1;

  // Our built-in 'ground' shape.

  let speed;
  let animSpeed;
  let roomMain;

  scene.ambientColor = new Color3(0.1, 0.1, 0.1);
  //scene.gravity = new Vector3(0,-0.75,0);
  scene.collisionsEnabled = true;

  scene.gravity.y = -0.08;

  // camera
  //const camera = new UniversalCamera("UniversalCamera", new Vector3(5,5,22), scene);
  camera.setTarget(Vector3.Zero());

  camera.checkCollisions = true;

  camera.applyGravity = true;

  camera.checkCollisions = true;
  camera.applyGravity = true;

  camera.ellipsoid = new Vector3(0.5, 1, 0.5);

  camera.minZ = 0.35;

  camera.attachControl(SceneComponent, true);

  camera.speed = 0.75;

  camera.angularSensibility = 4000;

  var gravityVector = new Vector3(0, -9.81, 0);
  var physicsPlugin = new CannonJSPlugin();
  scene.enablePhysics(gravityVector, physicsPlugin);

  const pointer = MeshBuilder.CreateSphere("Sphere", { diameter: 0.01 }, scene);
  pointer.position.x = 0.0;
  pointer.position.y = 0.0;
  pointer.position.z = 0.0;
  pointer.isPickable = false;

  let moveForward = false;
  let moveBackward = false;
  let moveRight = false;
  let moveLeft = false;
  let moveUp = false;
  let moveDown = false;

  camera.keysUp.push(87);
  camera.keysLeft.push(65);
  camera.keysDown.push(83);
  camera.keysRight.push(68);

  const hemiLight = new HemisphericLight(
    "hemiLight",
    new Vector3(0, 2, 0),
    scene
  );

  hemiLight.intensity = 0.005;

  //const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

  // const board = SceneLoader.ImportMesh('','./models/','board.gltf',scene,(meshes) => {
  //   console.log('meshes',meshes)
  // })

  const loadModels = async (modelName) => {
    try {
      const result = await SceneLoader.ImportMeshAsync(
        "",
        "/models/",
        modelName
      );
      // Do something with the result here
      return result; // You can return the result if needed
    } catch (error) {
      // Handle errors if necessary
      console.error(error);
      throw error; // Re-throw the error if needed
    }
  };

  // Call the function
  const { meshes } = await loadModels("city.glb");

  // Example function to apply physics to meshes with geometry
  meshes.forEach((mesh) => {
    mesh.unfreezeWorldMatrix();

    if (mesh.name === "mainroom") {
      mesh.checkCollisions = false;
      roomMain = mesh;
      console.log("this is the mesh", mesh);
    } else {
      mesh.checkCollisions = true;
    }
  });

  let boardRootMesh = meshes
    .find((mesh) => mesh.name === "__root__")
    ?.unfreezeWorldMatrix();

  function isCameraInMesh(mesh) {
    const boundingInfo = mesh.getBoundingInfo();
    const boundingBox = boundingInfo.boundingBox;

    const min = boundingBox.minimumWorld;
    const max = boundingBox.maximumWorld;

    const { x, y, z } = camera.position;

    return (
      x >= min.x &&
      x <= max.x &&
      y >= min.y &&
      y <= max.y &&
      z >= min.z &&
      z <= max.z
    );
  }

  // Update function to adjust the ellipsoid's Y coordinate
  function updateCameraEllipsoid(mesh) {
    if (isCameraInMesh(mesh)) {
      camera.ellipsoid.y = 0.5; // Lower the ellipsoid's Y coordinate to 1
    } else {
      camera.ellipsoid.y = 3.2;
    }
  }
};

const onRender = (scene) => {
  if (box !== undefined) {
    const deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    // box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    // <div className="container">
    //   <h1>Welcome to Tauri!</h1>
    //   <h1>hello world</h1>

    //   <div className="row">
    //     <a href="https://vitejs.dev" target="_blank">
    //       <img src="/vite.svg" className="logo vite" alt="Vite logo" />
    //     </a>
    //     <a href="https://tauri.app" target="_blank">
    //       <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
    //     </a>
    //     <a href="https://reactjs.org" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>

    //   <p>Click on the Tauri, Vite, and React logos to learn more.</p>

    //   <form
    //     className="row"
    //     onSubmit={(e) => {
    //       e.preventDefault();
    //       greet();
    //     }}
    //   >
    //     <input
    //       id="greet-input"
    //       onChange={(e) => setName(e.currentTarget.value)}
    //       placeholder="Enter a name..."
    //     />
    //     <button type="submit">Greet</button>
    //   </form>

    //   <p>{greetMsg}</p>
    // </div>

    <div>
      <SceneComponent
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
        id="my-canvas"
      />
    </div>
  );
}

export default App;
