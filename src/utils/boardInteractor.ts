import {fromEvent, Subscription} from 'rxjs';
import Renderer from './renderer';
import {BOARD_STATES_ENUM, BoardState} from '../types/consts/boardStates.consts';
import {Element, Line} from '@svgdotjs/svg.js';
import {DcbElement} from '../elements/dcbElement';
import React from 'react';
import * as _ from 'lodash';
import {filter} from 'rxjs/operators';
import {Pin, PIN_TYPES_ENUM} from '../elements/Pin/pin';
import store from '../store/store';
import {setBoardState} from '../store/actions/boardActions';
import {Wire} from '../elements/Wire/wire';

export class BoardInteractor {
  private static eventSubscription = new Subscription();
  private static svg: SVGSVGElement;
  private static ghost: Element | null;
  private static currentElement: DcbElement | null;
  private static elementsList: Array<DcbElement> = [];
  private static idCounter = 0;
  private static boardState: BoardState;
  private static wiresToBuildCoords: {
    main: null | {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    },
    bend: null | {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    },
  } = {
    main: null,
    bend: null
  };
  private static wiresToBuildModels: {
    main: null | Line,
    bend: null | Line
  } = {
    main: null,
    bend: null
  };
  private static wireData: {
    start: {
      element: DcbElement,
      pinIndex: number,
      pinType: PIN_TYPES_ENUM
    } | null,
    end: {
      element: DcbElement,
      pinIndex: number,
      pinType: PIN_TYPES_ENUM
    } | null,
  } = {
    start: null,
    end: null
  };
  private static coords = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  };

  public static init(boardWrapper: HTMLElement): void {
    Renderer.init(boardWrapper);

    this.svg = Renderer.svg.node;
  }

  private static resetBoardFields(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
    this.eventSubscription = new Subscription();

    if (this.ghost) {
      this.ghost.remove();
      this.ghost = null;
    }
  }

  private static getCoords(e: React.MouseEvent): Array<number> {
    const {left, top} = this.svg.getBoundingClientRect();

    return [
      e.pageX - left,
      e.pageY - top,
    ];
  }

  private static calcCoords(x: number, y: number): Array<number> {
    return [
      Math.floor(x / 12) * 12 + 5,
      Math.floor(y / 12) * 12 + 5,
    ];
  }

  private static drawElementGhost(e: React.MouseEvent): void {
    e.preventDefault();

    if (!this.currentElement) {
      return;
    }

    const [mouseX, mouseY] = this.getCoords(e);
    const [x, y] = this.calcCoords(mouseX, mouseY);

    this.coords.x1 = x;
    this.coords.y1 = y;

    if (this.ghost) {
      this.ghost.remove();
      this.ghost = null;
    }

    this.ghost = Renderer.makeElementBase(this.currentElement, x, y, true);
  }

  private static applyHelperEvents(element: DcbElement): void {
    const pins = _.union(element.inPins, element.outPins);

    _.forEach(pins, pin => {
      const {helper} = pin;

      if (!helper) {
        return;
      }

      fromEvent<React.MouseEvent>(helper.node, 'mousedown')
        .pipe(
          filter(() => this.boardState === BOARD_STATES_ENUM.EDIT)
        )
        .subscribe(() => {
          this.wireData.start = {
            element,
            pinIndex: pin.index,
            pinType: pin.type
          };

          store.dispatch(setBoardState(BOARD_STATES_ENUM.WIRE));
        });

      fromEvent<React.MouseEvent>(helper.node, 'mouseup')
        .pipe(
          filter(() => this.boardState === BOARD_STATES_ENUM.WIRE)
        )
        .subscribe(() => {
          this.wireData.end = {
            element,
            pinIndex: pin.index,
            pinType: pin.type
          };
        });

      fromEvent<React.MouseEvent>(helper.node, 'mousemove')
        .pipe(
          filter(() => this.boardState === BOARD_STATES_ENUM.EDIT || this.boardState === BOARD_STATES_ENUM.WIRE)
        )
        .subscribe(() => {
          helper.opacity(1);
        });

      fromEvent<React.MouseEvent>(helper.node, 'mouseout')
        .pipe(
          filter(() => this.boardState === BOARD_STATES_ENUM.EDIT || this.boardState === BOARD_STATES_ENUM.WIRE)
        )
        .subscribe(() => {
          helper.opacity(0);
        });
    });
  }

  private static startWire(e: React.MouseEvent): void {
    e.preventDefault();

    const [mouseX, mouseY] = this.getCoords(e);
    const [x, y] = this.calcCoords(mouseX, mouseY);

    this.coords.x1 = x;
    this.coords.y1 = y;
  }

  private static wireOrientationCorrection(x1: number, y1: number, x2: number, y2: number) {
    if(x1 === x2) {
      x1++;
      x2++;
      if(y1 < y2) {
        y2 += 2;
      } else {
        y1 += 2;
      }
    } else if(y1 === y2) {
      y1++;
      y2++;
      if(x1 < x2) {
        x2 += 2;
      } else {
        x1 += 2;
      }
    }

    return [x1, y1, x2, y2];
  }

  private static drawWireGhost(e: React.MouseEvent): void {
    e.preventDefault();

    const [mouseX, mouseY] = this.getCoords(e);
    const [x, y] = this.calcCoords(mouseX, mouseY);

    this.coords.x2 = x;
    this.coords.y2 = y;

    const main = new Wire();
    const bend = new Wire();

    main.className = 'main';
    bend.className = 'bend';

    const {x1, y1, x2, y2} = this.coords;
    const plot = this.wiresToBuildModels.main ? this.wiresToBuildModels.main.plot() : null;

    if (this.wiresToBuildModels.main) {
      this.wiresToBuildModels.main.remove();
    }

    if (this.wiresToBuildModels.bend) {
      this.wiresToBuildModels.bend.remove();
    }

    if (y1 !== y2 && x1 !== x2) {
      let x1m, y1m, x2m, y2m;
      let x1b, y1b, x2b, y2b;

      if (plot && plot[0][0] === plot[0][1]) {
        [x1m, y1m, x2m, y2m] = [x1, y1, x1, y2];
        [x1b, y1b, x2b, y2b] = [x1, y2, x2, y2];
      } else {
        [x1m, y1m, x2m, y2m] = [x1, y1, x2, y1];
        [x1b, y1b, x2b, y2b] = [x2, y1, x2, y2];
      }
      [x1m, y1m, x2m, y2m] = this.wireOrientationCorrection(x1m, y1m, x2m, y2m);
      [x1b, y1b, x2b, y2b] = this.wireOrientationCorrection(x1b, y1b, x2b, y2b);

      this.wiresToBuildModels = {
        main: Renderer.createWireGhost(x1m, y1m, x2m, y2m),
        bend: Renderer.createWireGhost(x1b, y1b, x2b, y2b),
      };

      this.wiresToBuildCoords = {
        main: {
          x1: x1m,
          y1: y1m,
          x2: x2m,
          y2: y2m
        },
        bend: {
          x1: x1b,
          y1: y1b,
          x2: x2b,
          y2: y2b
        }
      };
    } else {
      const [x1m, y1m, x2m, y2m] = this.wireOrientationCorrection(x1,y1,x2,y2);

      this.wiresToBuildModels = {
        main: Renderer.createWireGhost(x1m, y1m, x2m, y2m),
        bend: null
      };

      this.wiresToBuildCoords = {
        main: {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
        },
        bend: null,
      };
    }
  }

  private static createElement(e: React.MouseEvent): void {
    e.preventDefault();

    if (!this.currentElement) {
      return;
    }

    const element = _.cloneDeep(this.currentElement);

    Renderer.createElement(element, this.coords.x1, this.coords.y1);

    element.id = `${element.name} ${this.idCounter}`;

    this.idCounter++;

    this.applyHelperEvents(element);
    this.elementsList.push(element);
  }

  private static applySubscriptions(...args: Array<Subscription>): void {
    _.forEach(args, subscription => {
      this.eventSubscription.add(subscription);
    });
  }

  public static setState(boardState: BoardState, element: DcbElement | null): void {
    this.resetBoardFields();
    this.currentElement = element;
    this.boardState = boardState;

    switch (boardState) {
      case BOARD_STATES_ENUM.CREATE:
        this.applySubscriptions(
          fromEvent<React.MouseEvent>(this.svg, 'mousemove')
            .subscribe(e => this.drawElementGhost(e)),
          fromEvent<React.MouseEvent>(this.svg, 'click')
            .subscribe(e => this.createElement(e))
        );
        break;
      case BOARD_STATES_ENUM.EDIT:
        break;
      case BOARD_STATES_ENUM.WIRE:
        this.applySubscriptions(
          fromEvent<React.MouseEvent>(this.svg, 'mouseup')
            .subscribe(e => {
              this.wireData = {
                start: null,
                end: null
              };

              store.dispatch(setBoardState(BOARD_STATES_ENUM.EDIT));
            }),
          fromEvent<React.MouseEvent>(this.svg, 'mousedown')
            .subscribe(e => this.startWire(e)),
          fromEvent<React.MouseEvent>(this.svg, 'mousemove')
            .subscribe(e => this.drawWireGhost(e))
        );
        break;
      default:
        break;
    }
  }
}
