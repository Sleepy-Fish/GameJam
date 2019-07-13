import * as PIXI from 'pixi.js';
import { MenuState, GameState, OptionsState, LoadState } from './states';
import C from './constants.json';

const app = new PIXI.Application({
  autoResize: true,
  resolution: devicePixelRatio
});
document.body.appendChild(app.view);

let CurrentState = null;
const states = {
  menu: new MenuState(app),
  game: new GameState(app),
  options: new OptionsState(app),
  load: new LoadState(app)
};

window.changeState = function(state) {
  for (const key in states) {
    states[key].deactivate();
  }
  states[state].activate();
  CurrentState = states[state];
  resize();
};

window.changeState('menu');

function resize() {
  const rendererWidth = Math.min(window.innerWidth, C.MAX_WIDTH);
  app.renderer.resize(rendererWidth, window.innerHeight);
  app.renderer.view.style.position = 'absolute';
  app.renderer.view.style.left = (window.innerWidth / 2) - (rendererWidth / 2) + 'px';
  CurrentState.resize(rendererWidth, window.innerHeight);
}
window.addEventListener('resize', resize);
window.changeState('load');
states.load.loadAssets().then(() => {
  window.changeState('menu');
  function loop(delta) {
    CurrentState.run(delta);
  }
  app.ticker.add(delta => loop(delta));
});
