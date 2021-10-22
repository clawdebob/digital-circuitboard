import {Circle, Element, G, Line, Rect, SVG, Svg} from '@svgdotjs/svg.js';
import tile from '../assets/tile5px.png';
import * as _ from 'lodash';
import {DcbElement} from '../elements/dcbElement';
import {Wire, WireHelper} from '../elements/Wire/wire';
import {ELEMENT} from '../types/consts/element.consts';

class Renderer {
  private static boardContainer: HTMLElement;
  public static svg: Svg;
  public static board: G;
  public static background: G;
  private static middleGround: G;
  public static foreground: G;

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

  public static clearScene(): void {
    this.background.clear();
    this.middleGround.clear();
    this.foreground.clear();
  }

  public static createRect(x: number, y: number, width: number, height: number): Rect {
    return this.svg.rect(width, height)
      .x(x)
      .y(y);
  }

  public static createCircle(x: number, y: number, diameter: number): Circle {
    return this.svg.circle(diameter)
      .x(x  - diameter / 2)
      .y(y  - diameter / 2);
  }

  public static applySelection(element: DcbElement): G {
    const zoneGroup = this.svg.group();
    const rectWidth = 7;
    const {x, y, width, height, originY} = element.dimensions;
    const zoneCoords = [
      {x: x - rectWidth, y: y - originY - rectWidth},
      {x: x - rectWidth, y: y + height - originY},
      {x: x + width, y: y - originY - rectWidth},
      {x: x + width, y: y + height - originY},
    ];

    _.forEach(zoneCoords, coords => {
      const rect = this.svg.rect(rectWidth, rectWidth)
        .fill('#ffffff')
        .stroke('#000000')
        .attr('shape-rendering', 'crispedges')
        .x(coords.x)
        .y(coords.y);

      zoneGroup.add(rect);
    });

    return zoneGroup;
  }

  public static makeElementBase(element: DcbElement, x: number, y: number, isGhost = false): Element {
    const {props, dimensions} = element;
    const {fill} = props;
    let base;

    if (dimensions.radius) {
      base = this.createCircle(x + dimensions.radius, y - dimensions.originY + dimensions.radius, dimensions.radius * 2);
    } else {
      base = this.createRect(x, y - dimensions.originY, dimensions.width, dimensions.height);
    }

    if (fill) {
      base.fill(fill);
    }

    base.stroke('#000000');

    if (element.name === ELEMENT.LABEL) {
      base
        .fill('transparent')
        .stroke('transparent');
    }

    if (isGhost) {
      const ghost = this.svg.group();

      base.opacity(0.5);

      if (element.signature && element.name === ELEMENT.LABEL) {
        const text = this.background
          .text(element.props.labelText || element.signature)
          .attr('font-size', element.props.fontSize || 24)
          .opacity(0.5)
          .fill(String(element.props.fill))
          .cx(x)
          .cy(y);

        ghost.add(text);
      }

      ghost.add(base);
      this.foreground.add(ghost);

      return ghost;
    }

    return base;
  }

  private static createHelper(x: number, y: number): Circle {
    const diameter = 10;

    return this.createCircle(x, y, diameter)
      .addClass('help-circle')
      .opacity(0)
      .fill('#00000000')
      .stroke('#14ff53');
  }

  private static createInvertCircle(x: number, y: number): Circle {
    const diameter = 7;

    return this.createCircle(x, y, diameter)
      .addClass('invert-circle')
      .fill('#ffffff')
      .stroke('#000000');
  }

  public static createJunction(x: number, y: number, color = '#000000'): Circle {
    const diameter = 6;
    const circle = this.createCircle(x, y, diameter)
      .addClass('junction')
      .fill(color);

    this.background.add(circle);

    return circle;
  }

  public static createWireModel(x1: number, y1: number, x2: number, y2: number): Line {
    return this.svg.line([x1, y1, x2, y2])
      .stroke({
        color: '#000000',
        width: 2
      })
      .addTo(this.middleGround);
  }

  public static getJunctionHelpers(x1: number, y1: number, x2: number, y2: number): Array<WireHelper> {
    const startCoord = x1 === x2 ? y1 : x1;
    const endCoord = x1 === x2 ? y2 : x2;
    const helpers = [];

    if (y1 < y2 || x1 < x2) {
      for (let coord = startCoord + 1; coord < endCoord; coord += 12) {
        helpers.push({
          isEnabled: true,
          model: this.createHelper(
            x1 === x2 ? x1 : coord,
            x1 === x2 ? coord : y1
          )
        });
      }
    } else {
      for (let coord = startCoord - 1; coord > endCoord; coord -= 12) {
        helpers.push({
          isEnabled: true,
          model: this.createHelper(
            x1 === x2 ? x1 : coord,
            x1 === x2 ? coord : y1
          )
        });
      }
    }

    _.forEach(helpers, (data, idx) => {
      if (idx === 0 || idx === helpers.length - 1) {
        data.isEnabled = false;
        this.background.add(data.model);

        return;
      }

      this.foreground.add(data.model);
    });

    return helpers;
  }

  public static createWire(x1: number, y1: number, x2: number, y2: number): Wire {
    const wire = new Wire();

    wire.modelData.model = this.createWireModel(x1, y1, x2, y2);
    wire.helpers = [
      {isEnabled: true, model: this.createHelper(x1, y1)},
      {isEnabled: true, model: this.createHelper(x2, y2)}
    ];

    wire.junctionHelpers = this.getJunctionHelpers(x1, y1, x2, y2);

    _.forEach(wire.helpers, data => {
      this.foreground.add(data.model);
    });

    return wire;
  }

  public static createWireGhost(x1: number, y1: number, x2: number, y2: number): Line {
    return this.createWireModel(x1, y1, x2, y2)
      .opacity(0.5);
  }

  public static createElement(element: DcbElement, x: number, y: number): void {
    const group = this.background.group();
    const base = this.makeElementBase(element, x, y);

    group.add(base);

    if (element.inPins.length) {
      element.inPins = _.map(element.inPins, pin => {
        const [startCoords, endCoords] = pin.positionData.coords;
        const line = this.background.line(
          startCoords.x + x,
          startCoords.y + y,
          endCoords.x + x,
          endCoords.y + y,
        );
        const helper = this.createHelper(startCoords.x + x, startCoords.y + y);

        line.opacity(1);
        line.stroke({
          color: '#000000',
          width: 2
        });
        group.add(line);
        this.foreground.add(helper);

        if (pin.invert) {
          group.add(this.createInvertCircle(endCoords.x + x, endCoords.y + y));
        }

        return {
          ...pin,
          model: line,
          helper,
        };
      });
    }

    if (element.outPins.length) {
      element.outPins = _.map(element.outPins, pin => {
        const [startCoords, endCoords] = pin.positionData.coords;
        const line = this.background.line(
          startCoords.x + x,
          startCoords.y + y,
          endCoords.x + x,
          endCoords.y + y,
        );
        const helper = this.createHelper(endCoords.x + x, endCoords.y + y);

        line.opacity(1);
        line.stroke({
          color: '#000000',
          width: 2
        });
        group.add(line);
        this.foreground.add(helper);

        if (pin.invert) {
          group.add(this.createInvertCircle(startCoords.x + x, startCoords.y + y));
        }

        return {
          ...pin,
          model: line,
          helper
        };
      });
    }

    if (element.isInteractive) {
      group.addClass('interactive-element');
    }

    if (element.signature) {
      const text = this.background.text(element.signature);

      text.attr('font-size', 24);

      if (element.name === ELEMENT.LABEL) {
        text
          .text(String(element.props.labelText))
          .fill(String(element.props.fill))
          .attr('font-size', element.props.fontSize)
          .cx(x)
          .cy(y);
      } else {
        text
          .cx(x + element.dimensions.width / 2)
          .attr('font-size', 24)
          .y(y);
      }

      element.modelData.signatureModel = text;

      group.add(text);
    }

    element.modelData.model = group;
    element.dimensions = {
      ...element.dimensions,
      x,
      y
    };

    this.background.add(group);
  }

  // public static setBoardZoom(zoom: number, mouseX: number, mouseY: number): void {
  //   const {left, top} = this.svg.node.getBoundingClientRect();
  //   const scale = zoom / 100;
  //   const x = (mouseX - left) / scale;
  //   const y = (mouseY - top) / scale;
  //
  //   this.svg.transform({scaleX: scale, scaleY: scale});
  //
  //   const {width, height} = this.svg.node.getBoundingClientRect();
  //   this.svg.size(width, height);
  // }
}

export default Renderer;
