import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
    -10, 10,
    10, -10,
    0.1, 1000
);
camera.position.set(15, 15, 15);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    precision: 'highp'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Create coordinate system
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// Function to create an arrow for vector visualization
function createVectorArrow(origin, direction) {
    const length = direction.length();
    const arrowHelper = new THREE.ArrowHelper(
        direction.normalize(),
        origin,
        length,
        0x000000,
        length * 0.2,  // head length
        length * 0.1   // head width
    );
    return arrowHelper;
}

// Function to calculate vector field at a point
function calculateVectorField(x, y, z) {
    // Example vector field: (y, -x, z)
    // This creates a circular pattern in XY plane and linear in Z
    return new THREE.Vector3(y, -x, z);
}

// Create vector field
function createVectorField() {
    const vectorField = new THREE.Group();
    const gridSize = 2;  // Number of points in each direction
    const spacing = 2;   // Space between points

    for (let x = -gridSize; x <= gridSize; x++) {
        for (let y = -gridSize; y <= gridSize; y++) {
            for (let z = -gridSize; z <= gridSize; z++) {
                const origin = new THREE.Vector3(
                    x * spacing,
                    y * spacing,
                    z * spacing
                );
                
                const vector = calculateVectorField(
                    x * spacing,
                    y * spacing,
                    z * spacing
                );
                
                const arrow = createVectorArrow(origin, vector);
                vectorField.add(arrow);
            }
        }
    }

    return vectorField;
}

const vectorField = createVectorField();
scene.add(vectorField);

// Animation
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Optionally animate the vector field
    time += 0.01;
    vectorField.children.forEach((arrow, index) => {
        const position = arrow.position;
        const vector = calculateVectorField(
            position.x,
            position.y,
            position.z + Math.sin(time) * 0.5  // Add some movement
        );
        arrow.setDirection(vector.normalize());
        arrow.setLength(
            vector.length(),
            vector.length() * 0.2,
            vector.length() * 0.1
        );
    });
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 20;
    
    camera.left = -frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = -frustumSize / 2;
    
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}

animate();