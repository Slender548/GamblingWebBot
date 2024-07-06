const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, sizes.width, sizes.height, 0.1, 1000);
scene.add(camera);
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
const bodyElement = document.querySelector("body");

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        transparent: true,
        color: 0xFEE60B,
        opacity: 1,
        alphaMap: alphaShadow
    })
)
sphereShadow.rotation.x = -Math.PI * -0.1
sphereShadow.position.y = -0.5
sphereShadow.position.x = 1.5;
scene.add(sphereShadow)
cube.rotation.x = 0
    cube.rotation.y = -0.4
    cube.rotation.z = 0
    const clock = new THREE.Clock()
    let lastElapsedTime = 0
    
    const tick = () => {
        const elapsedTime = clock.getElapsedTime()
        lastElapsedTime = elapsedTime
    
        // Render
        renderer.render(scene, camera)
    
        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }
    
    tick()
    var transformCube = [];
    transformCube = [{
            positionX: Math.PI * 0,
            positionY: Math.PI * -0.12,
            positionZ: Math.PI * 0,
        }
    ]
