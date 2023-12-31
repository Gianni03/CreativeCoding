// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const eases = require('eases');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const canvasSketch = require('canvas-sketch');

const settings = {
  dimentions: [512, 512],
  fps: 24,
  duration: 4,

  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true },
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor('hsl(0, 0%, 95%)', 1);

  // Setup a camera
  // const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  // camera.position.set(2, 2, -8);
  // camera.lookAt(new THREE.Vector3());
  const camera = new THREE.OrthographicCamera();

  // Setup camera controller
  // const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  const palette = random.pick(palettes);

  const box = new THREE.BoxGeometry(1, 1, 1);

  for (let i = 0; i < 250; i++) {
    // Setup a mesh with geometry + material
    const mesh = new THREE.Mesh(
      box,
      new THREE.MeshStandardMaterial({
        color: random.pick(palette),
      })
    );
    mesh.position.set(
      random.gaussian(-1, 1),
      random.gaussian(-1, 1),
      random.gaussian(-1, 1)
    );
    mesh.scale.set(
      random.gaussian(-1, 1),
      random.gaussian(-1, 1),
      random.gaussian(-1, 1)
    );

    mesh.scale.multiplyScalar(0.25);
    scene.add(mesh);
  }

scene.add(new THREE.AmbientLight('hsl(0, 0%, 30%)'))

  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(1, 4, 1);
  scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 2;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -50;
      camera.far = 50;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead }) {
      const t = Math.sin(playhead * Math.PI )
      scene.rotation.y = t * 2;
      scene.rotation.z = eases.expoInOut(t);
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
