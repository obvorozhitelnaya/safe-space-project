const { Application, Graphics } = PIXI;

const AMOUNT = 600; 
const MAX_SIZE = 10; 
const MIN_SIZE = 2;  
const OPACITY_MIN = 0.5; 
const OPACITY_MAX = 1.0; 
const COLOR = 0xffffff;

const randomInRange = (min, max) => Math.random() * (max - min) + min;


const createSnowflakeTextures = (app) => {
    const textures = [];
    for (let i = 0; i < 15; i++) { 
        const g = new Graphics();
        const sizeVar = randomInRange(0.7, 1.5);
        const opacity = randomInRange(OPACITY_MIN, OPACITY_MAX);

        g.beginFill(COLOR, opacity);

        const rays = Math.floor(randomInRange(5, 9));
        const points = [];
        const radius = 25 * sizeVar;

        for (let i = 0; i < rays; i++) {
            const angle = (i / rays) * Math.PI * 2;
            const rayVar = randomInRange(0.6, 1.4);
            points.push(
                Math.cos(angle) * radius * rayVar,
                Math.sin(angle) * radius * rayVar
            );
        }

        g.drawPolygon(points);
        g.endFill();
        textures.push(app.renderer.generateTexture(g));
    }
    return textures;
};

const app = new Application({
    view: document.querySelector(".snowfall"),
    antialias: true,
    transparent: true,
    width: window.innerWidth,
    height: window.innerHeight,
    autoStart: true 
});

app.view.style.opacity = 1;

const snowflakesContainer = new PIXI.particles.ParticleContainer(AMOUNT, {
    scale: true,
    position: true,
    alpha: true,
    rotation: true,
});
app.stage.addChild(snowflakesContainer);

const snowflakeTextures = createSnowflakeTextures(app);

const snowflakes = new Array(AMOUNT).fill().map(() => {
    const sizeVar = randomInRange(0.8, 1.5); 
    const texture = snowflakeTextures[Math.floor(Math.random() * snowflakeTextures.length)];
    const flake = new PIXI.Sprite(texture);

    flake.scale.set(sizeVar * 0.08); 
    flake.alpha = randomInRange(OPACITY_MIN, OPACITY_MAX);
    flake.x = randomInRange(-100, app.renderer.width + 100);
    flake.y = randomInRange(-app.renderer.height, app.renderer.height); 
    flake.vx = randomInRange(-0.8, 0.8);
    flake.vy = randomInRange(1.0, 3.0); 
    flake.wobbleSpeed = randomInRange(0.02, 0.06);
    flake.wobbleAmount = randomInRange(0.8, 2.5);
    flake.rotation = randomInRange(0, Math.PI * 2);

    snowflakesContainer.addChild(flake);
    return flake;
});


app.ticker.add(() => {
    snowflakes.forEach((flake) => {
        flake.y += flake.vy;
        flake.x += flake.vx;

    
        flake.vx = Math.sin(flake.y * flake.wobbleSpeed) * flake.wobbleAmount * 0.15;
        flake.rotation += flake.vy * 0.005; 

        
        if (flake.y > app.renderer.height + 50) {
            flake.x = randomInRange(-100, app.renderer.width + 100);
            flake.y = randomInRange(-200, -50);
            flake.vy = randomInRange(1.0, 3.0);
        }
        else if (flake.x < -150) {
            flake.x = app.renderer.width + 100;
        }
        else if (flake.x > app.renderer.width + 150) {
            flake.x = -100;
        }
    });
});


window.addEventListener("resize", () => {
    const ratioX = window.innerWidth / app.renderer.width;
    const ratioY = window.innerHeight / app.renderer.height;

    
    snowflakes.forEach(flake => {
        flake.x *= ratioX;
        flake.y *= ratioY;
    });

    app.renderer.resize(window.innerWidth, window.innerHeight);
});

app.start();