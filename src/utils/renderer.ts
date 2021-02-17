import {Svg, G, Element, SVG, Rect} from '@svgdotjs/svg.js';
import tile from '../assets/tile5px.png';
import * as _ from 'lodash';

class Renderer {
  private static boardContainer: HTMLElement;
  private static svg: Svg;
  public static board: G;
  private static background: G;
  private static middleGround: G;
  private static foreground: G;

  public static init(element: HTMLElement): void {
    this.boardContainer = element;
    this.svg = SVG()
      .addTo(element)
      .size(2000, 2000);

    this.svg.defs()
      .pattern(12,12)
      .id('grid-pattern')
      .image(tile)
      .size(12,12);

    this.board = this.svg.group();

    this.background = this.board.group();
    this.middleGround = this.board.group();
    this.foreground = this.board.group();

    this.background.add(this.createRect(500,500,1000,1000)
      .addClass('field-piece')
      .fill('url(#grid-pattern)')
    );
  }

  public static createRect(x: number, y: number, width: number, height: number): Rect {
    return this.svg.rect(width, height).x(x).y(y);
  }

  public static setBoardZoom(zoom: number): void {
    this.board.transform({scaleX: zoom / 100, scaleY: zoom / 100});
    const {width, height} = this.svg.node.getBoundingClientRect();

    // this.svg.size(width, height);

    console.log();
  }
}

export default Renderer;
