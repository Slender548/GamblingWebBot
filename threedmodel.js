        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Physics setup
        const world = new CANNON.World();
        world.gravity.set(0, -9.82, 0);

        // Ground
        const groundBody = new CANNON.Body({ mass: 0 });
        groundBody.addShape(new CANNON.Plane());
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        world.addBody(groundBody);

        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        scene.add(ground);

        // Load 3D model
        const loader = new THREE.GLTFLoader();
        loader.load('Pathfinder_2k.glb', (gltf) => {
            const model = gltf.scene;
            scene.add(model);

            // Create physics body for model
            const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1)); // Adjust size as needed
            const body = new CANNON.Body({ mass: 1 });
            body.addShape(shape);
            body.position.set(0, 5, 0); // Start above the ground
            world.addBody(body);

            // Animate and synchronize physics with Three.js
            const animate = () => {
                requestAnimationFrame(animate);
                world.step(1 / 60);

                // Sync Three.js model with Cannon.js body
                model.position.copy(body.position);
                model.quaternion.copy(body.quaternion);

                renderer.render(scene, camera);
            };
            animate();

            // Handle mouse/touch events
            renderer.domElement.addEventListener('click', (event) => {
                coordinates
                const mouse = new THREE.Vector2();
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

                // Raycasting to detect click on model
                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObject(model, true);

                if (intersects.length > 0) {
                    // Apply force or impulse to the physics body
                    const force = new CANNON.Vec3(0, 500, 0); // Example force vector
                    body.applyImpulse(force, body.position);
                }
            });
        });

        camera.position.z = 10;