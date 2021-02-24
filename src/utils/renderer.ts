import {Svg, G, Element, SVG, Rect} from '@svgdotjs/svg.js';
import tile from '../assets/tile5px.png';
import * as _ from 'lodash';
import {DcbElement} from '../elements/dcbElement';

class Renderer {
  private static boardContainer: HTMLElement;
  public static svg: Svg;
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
  }

  public static createRect(x: number, y: number, width: number, height: number): Rect {
    return this.svg.rect(width, height).x(x).y(y);
  }

  public static makeElement(element: DcbElement, x: number, y: number, isGhost = false): Element {
    const {props, dimensions} = element;
    const {fill} = props;

    const rect = this.createRect(x, y - dimensions.originY, dimensions.width, dimensions.height);

    if (fill) {
      rect.fill(fill);
    }

    rect.stroke('#000000');

    if (isGhost) {
      rect.opacity(0.5);
      rect.addClass('ghost');
      this.foreground.add(rect);
    }

    return rect;
  }

  public static setBoardZoom(zoom: number, mouseX: number, mouseY: number): void {
    const {left, top} = this.svg.node.getBoundingClientRect();
    const scale = zoom / 100;
    const x = (mouseX - left) / scale;
    const y = (mouseY - top) / scale;

    this.svg.transform({scaleX: scale, scaleY: scale});

    const {width, height} = this.svg.node.getBoundingClientRect();
    this.svg.size(width, height);
  }
}

export default Renderer;
