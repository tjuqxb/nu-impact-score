const Application = PIXI.Application;

const app = new Application({
  width: 500,
  height: 500,
  transparent: false,
  antialias: true,
});

app.renderer.backgroundColor = 0x23395d;

app.renderer.resize(window.innerWidth, window.innerHeight);

document.getElementById('wrapper_pixi').appendChild(app.view);
const Graphics = PIXI.Graphics;

const rectangle = new Graphics();
const poly = new Graphics();
rectangle
  .beginFill(0xaa33bb)
  .lineStyle(4, 0xffea00, 1)
  .drawRect(200, 200, 100, 120)
  .endFill();

app.stage.addChild(rectangle);

poly
  .beginFill(0xff66ff)
  .lineStyle(5, 0xffea00, 1)
  .drawPolygon([600, 50, 800, 150, 900, 300, 400, 400])
  .endFill();

app.stage.addChild(poly);

const circle = new Graphics();
circle.beginFill(0x22aacc).drawCircle(440, 200, 80).endFill();
app.stage.addChild(circle);

const line = new Graphics();
line.lineStyle(5, 0xffea00, 1).moveTo(1500, 100).lineTo(1500, 800);

app.stage.addChild(line);

const torus = new Graphics();
torus
  .beginFill(0xff384f0)
  .drawTorus(0, 0, 50, 70, 0.1, (Math.PI * 2) / 3 - 0.1)
  .endFill();

app.stage.addChild(torus);

const star = new Graphics();
star.beginFill(0xadadad).drawStar(900, 700, 5, 80).endFill();

app.stage.addChild(star);

const style = new PIXI.TextStyle({
  fontFamily: 'Monsterrat',
  fontSize: 48,
  fill: 'deepskyblue',
});

const myText = new PIXI.Text('hello', style);
app.stage.addChild(myText);

// app.ticker.add((delta) => loop(delta));

// function loop(delta) {
//   const rectangle = new Graphics();

//   rectangle
//     .beginFill(0xaa33bb)
//     .lineStyle(4, 0xffea00, 1)
//     .drawRect(
//       Math.random() * app.screen.width,
//       Math.random() * app.screen.height,
//       100,
//       120
//     )
//     .endFill();

//   app.stage.addChild(rectangle);
// }

const testTexture = PIXI.Texture.from('./images/cat.png');

// testSprite.scale.x = 1.5;
// testSprite.scale.y = 2;
// app.stage.addChild(testSprite);

// testSprite.x = 200;
// testSprite.interactive = true;
// testSprite.buttonMode = true;
// testSprite.on('pointerdown', () => {
//   testSprite.scale.x += 0.1;
// });

let pointerMarker = class {
  constructor(x, y, message) {
    this.icon = new Graphics();
    this.icon.beginFill(0xadadad).drawStar(x, y, 5, 80).endFill();
    this.icon.interactive = true;
    this.message = message;
    this.icon.x = x;
    this.icon.y = y;
    app.stage.addChild(this.icon);
    this.icon.on('pointerdown', this.testFunc.bind(this));
  }
  testFunc() {
    this.icon.scale.x += 0.1;
    console.log(this.message);
    app.stage.removeChild(this.icon);
  }
};

let testPoint = new pointerMarker(200, 200, 'hello');

const container = new PIXI.Container();

const loader = PIXI.Loader.shared;
loader.add('testTexture2', './images/cat.png');
loader.load(setup);

function setup(loader, resources) {
  const catSprite = new PIXI.Sprite(resources.testTexture2.texture);
  catSprite.y = 400;
  app.stage.addChild(catSprite);
}
