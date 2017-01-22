import {Game} from './';
import './index.css';

window.onload = main;

function main() {
  let game = new Game();
  // Now kick off the display.
  game.render();
}
