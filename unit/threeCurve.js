import * as THREE from "three";

const scene = new THREE.Scene();
const frustumSize = 20;
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    1000
);
camera.position.set(10, 10, 10);
camera.lookAt(new THREE.Vector3(0, 0, 0));
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    precision: 'highp'
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

const axesLength = 10;
const tickSpacing = 1;

// Create material for all axes
const axisMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

// Create axes with arrows
function createAxisWithArrow(direction) {
    const group = new THREE.Group();
    
    // Create main axis line
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        direction.clone().multiplyScalar(axesLength)
    ]);
    const line = new THREE.Line(lineGeometry, axisMaterial);
    group.add(line);
    
    // Create arrow head
    const arrowLength = 0.5;
    const arrowWidth = 0.2;
    const tipPosition = direction.clone().multiplyScalar(axesLength);
    
    // Calculate arrow head vertices based on direction
    let vertices;
    if (direction.x === 1) {  // X axis
        vertices = new Float32Array([
            tipPosition.x - arrowLength, arrowWidth, 0,
            tipPosition.x - arrowLength, -arrowWidth, 0,
            tipPosition.x, 0, 0
        ]);
    } else if (direction.y === 1) {  // Y axis
        vertices = new Float32Array([
            arrowWidth, tipPosition.y - arrowLength, 0,
            -arrowWidth, tipPosition.y - arrowLength, 0,
            0, tipPosition.y, 0
        ]);
    } else {  // Z axis
        vertices = new Float32Array([
            0, arrowWidth, tipPosition.z - arrowLength,
            0, -arrowWidth, tipPosition.z - arrowLength,
            0, 0, tipPosition.z
        ]);
    }
    
    const arrowGeometry = new THREE.BufferGeometry();
    arrowGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const arrow = new THREE.Mesh(
        arrowGeometry, 
        new THREE.MeshBasicMaterial({ 
            color: 0x000000,
            side: THREE.DoubleSide 
        })
    );
    group.add(arrow);
    
    return group;
}

// Create and add axes with arrows
const xAxis = createAxisWithArrow(new THREE.Vector3(1, 0, 0));
const yAxis = createAxisWithArrow(new THREE.Vector3(0, 1, 0));
const zAxis = createAxisWithArrow(new THREE.Vector3(0, 0, 1));

scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);

// Function to create text sprite
function createTextSprite(text, color = '#000000') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 64;
    canvas.height = 64;

    context.font = '48px Arial';
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.5, 0.5, 1);
    
    return sprite;
}

function createTicks(origin, direction, length, spacing, color) {
    const tickGroup = new THREE.Group();
    const tickSize = 0.2;
    const tickMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    for (let i = spacing; i < length; i += spacing) {
        // Create tick mark
        const tickGeometry = new THREE.BufferGeometry();
        const pos = origin.clone().add(direction.clone().multiplyScalar(i));
        
        let vertices;
        if (direction.x === 1) {  // X axis
            vertices = new Float32Array([
                pos.x, pos.y - tickSize/2, pos.z,
                pos.x, pos.y + tickSize/2, pos.z
            ]);
        } else if (direction.y === 1) {  // Y axis
            vertices = new Float32Array([
                pos.x - tickSize/2, pos.y, pos.z,
                pos.x + tickSize/2, pos.y, pos.z
            ]);
        } else {  // Z axis
            vertices = new Float32Array([
                pos.x, pos.y - tickSize/2, pos.z,
                pos.x, pos.y + tickSize/2, pos.z
            ]);
        }
        
        tickGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const tick = new THREE.Line(tickGeometry, tickMaterial);
        tickGroup.add(tick);

        // Add label
        const label = createTextSprite(i.toString());
        label.position.copy(pos);
        if (direction.x === 1) {
            label.position.y -= 0.5;
        } else if (direction.y === 1) {
            label.position.x -= 0.5;
        } else {
            label.position.y -= 0.5;
        }
        tickGroup.add(label);
    }

    return tickGroup;
}

const xTicks = createTicks(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), axesLength, tickSpacing);
const yTicks = createTicks(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), axesLength, tickSpacing);
const zTicks = createTicks(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1), axesLength, tickSpacing);

scene.add(xTicks);
scene.add(yTicks);
scene.add(zTicks);

// Add axis labels
const xLabel = createTextSprite('X');
xLabel.position.set(axesLength + 1, 0, 0);
scene.add(xLabel);

const yLabel = createTextSprite('Y');
yLabel.position.set(0, axesLength + 1, 0);
scene.add(yLabel);

const zLabel = createTextSprite('Z');
zLabel.position.set(0, 0, axesLength + 1);
scene.add(zLabel);

// Create sine curve
let frequency = 0.2;  // starting frequency
const amplitude = 2;
const segments = 100;

function updateSineCurve() {
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * axesLength;
        const y = amplitude * Math.sin(frequency * x * Math.PI);
        points.push(new THREE.Vector3(x, y, 0));
    }
    return points;
}

// Create initial sine curve
const sineGeometry = new THREE.BufferGeometry();
const sineMaterial = new THREE.LineBasicMaterial({ 
    color: 0x000000,
    linewidth: 2
});
const sineCurve = new THREE.Line(sineGeometry, sineMaterial);
scene.add(sineCurve);

// Update the curve's points
function updateCurveGeometry() {
    const points = updateSineCurve();
    sineGeometry.setFromPoints(points);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Update frequency
    frequency += 0.01;
    if (frequency > 3) frequency = 0.2;  // reset when it gets too high
    
    // Update curve
    updateCurveGeometry();
    
    renderer.render(scene, camera);
}
animate();

// Add window resize handler
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = frustumSize * aspect / -2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}
