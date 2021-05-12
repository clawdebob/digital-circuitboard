import {fromEvent, Subscription} from 'rxjs';
import Renderer from './renderer';
import {BOARD_STATES_ENUM, BoardState} from '../types/consts/boardStates.consts';
import {Element, Line} from '@svgdotjs/svg.js';
import {DcbElement} from '../elements/dcbElement';
import React from 'react';
import * as _ from 'lodash';
import {filter} from 'rxjs/operators';
import {Pin} from '../elements/Pin/pin';
import store from '../store/store';
import {setBoardState} from '../store/actions/boardActions';
import {Wire} from '../elements/Wire/wire';
import {ORIENTATION} from '../types/consts/orientation.const';

interface WireData {
  element: DcbElement;
  pin?: Pin;
  isJunction?: boolean;
}

export class BoardInteractor {
  private static eventSubscription = new Subscription();
  private static svg: SVGSVGElement;
  private static ghost: Element | null;
  private static currentElement: DcbElement | null;
  private static elementsList: Array<DcbElement> = [];
  private static wiresList: Array<Wire> = [];
  private static idCounter = 0;
  private static boardState: BoardState;
  private static mouseStart: {
    x: number;
    y: number;
  } = {
    x: -1,
    y: -1,
  };
  private static mouseEnd: {
    x: number;
    y: number;
  } = {
    x: -1,
    y: -1,
  };
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
    start: WireData | null,
    end: WireData | null,
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

    _.set(window, 'elements', this.elementsList);
    _.set(window, 'wires', this.wiresList);

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

  private static applyJunctionHelpers(wire: Wire): void {
    const helpers = wire.junctionHelpers;

    _.forEach(helpers, helper => {
      const node = helper.model.node;

      const mouseDown$ = fromEvent<React.MouseEvent>(node, 'mousedown')
        .pipe(
          filter(() => this.boardState === BOARD_STATES_ENUM.EDIT),
          filter(() => helper.isEnabled)
        ).subscribe(() => {
          this.wireData.start = {
            element: wire,
            isJunction: true
          };

          store.dispatch(setBoardState(BOARD_STATES_ENUM.WIRE));
        });

      wire.junctionSubscriptions.add(mouseDown$);

      const mouseUp$ = fromEvent<React.MouseEvent>(helper.model.node, 'mouseup')
        .pipe(
          filter(() => this.boardState === BOARD_STATES_ENUM.WIRE),
          filter(() => helper.isEnabled)
        )
        .subscribe(() => {
          this.wireData.end = {
            element: wire,
            isJunction: true
          };
        });

      wire.junctionSubscriptions.add(mouseUp$);

      const mouseMove$ = fromEvent<React.MouseEvent>(helper.model.node, 'mousemove')
        .pipe(
          filter(() => this.boardState === BOARD_STATES_ENUM.EDIT || this.boardState === BOARD_STATES_ENUM.WIRE),
          filter(() => helper.isEnabled)
        )
        .subscribe(() => {
          helper.model.opacity(1);
        });

      wire.junctionSubscriptions.add(mouseMove$);

      const mouseOut$ = fromEvent<React.MouseEvent>(helper.model.node, 'mouseout')
        .pipe(
          filter(() => this.boardState === BOARD_STATES_ENUM.EDIT || this.boardState === BOARD_STATES_ENUM.WIRE),
          filter(() => helper.isEnabled)
        )
        .subscribe(() => {
          helper.model.opacity(0);
        });

      wire.junctionSubscriptions.add(mouseOut$);
    });
  }

  private static applyWireHelpers(wire: Wire): void {
    const helpers = wire.helpers;

    _.forEach(helpers, helper => {
      const node = helper.model.node;

      const mouseDown$ = fromEvent<React.MouseEvent>(node, 'mousedown')
        .pipe(
          filter(() => this.boardState === BOARD_STATES_ENUM.EDIT),
          filter(() => helper.isEnabled)
        ).subscribe(() => {
          this.wireData.start = {
            element: wire
          };

          store.dispatch(setBoardState(BOARD_STATES_ENUM.WIRE));
        });

      wire.subscriptions.add(mouseDown$);

      const mouseUp$ = fromEvent<React.MouseEvent>(helper.model.node, 'mouseup')
        .pipe(
          filter(() => this.boardState === BOARD_STATES_ENUM.WIRE),
          filter(() => helper.isEnabled)
        )
        .subscribe(() => {
          this.wireData.end = {
            element: wire
          };
        });

      wire.subscriptions.add(mouseUp$);

      const mouseMove$ = fromEvent<React.MouseEvent>(helper.model.node, 'mousemove')
        .pipe(
          filter(() => this.boardState === BOARD_STATES_ENUM.EDIT || this.boardState === BOARD_STATES_ENUM.WIRE),
          filter(() => helper.isEnabled)
        )
        .subscribe(() => {
          helper.model.opacity(1);
        });

      wire.subscriptions.add(mouseMove$);

      const mouseOut$ = fromEvent<React.MouseEvent>(helper.model.node, 'mouseout')
        .pipe(
          filter(() => this.boardState === BOARD_STATES_ENUM.EDIT || this.boardState === BOARD_STATES_ENUM.WIRE),
          filter(() => helper.isEnabled)
        )
        .subscribe(() => {
          helper.model.opacity(0);
        });

      wire.subscriptions.add(mouseOut$);
    });

    this.applyJunctionHelpers(wire);
  }

  private static applyHelperEvents(element: DcbElement): void {
    const pins = _.union(element.inPins, element.outPins);

    _.forEach(pins, pin => {
      const {helper} = pin;

      if (!helper) {
        return;
      }

      const mouseDown$ = fromEvent<React.MouseEvent>(helper.node, 'mousedown')
        .pipe(
          filter(() => this.boardState === BOARD_STATES_ENUM.EDIT),
          filter(() => pin.helperEnabled)
        )
        .subscribe(() => {
          this.wireData.start = {
            element,
            pin
          };

          store.dispatch(setBoardState(BOARD_STATES_ENUM.WIRE));
        });

      element.subscriptions.add(mouseDown$);

      const mouseUp$ = fromEvent<React.MouseEvent>(helper.node, 'mouseup')
        .pipe(
          filter(() => this.boardState === BOARD_STATES_ENUM.WIRE),
          filter(() => pin.helperEnabled)
        )
        .subscribe(() => {
          this.wireData.end = {
            element,
            pin
          };
        });

      element.subscriptions.add(mouseUp$);

      const mouseMove$ = fromEvent<React.MouseEvent>(helper.node, 'mousemove')
        .pipe(
          filter(() => this.boardState === BOARD_STATES_ENUM.EDIT || this.boardState === BOARD_STATES_ENUM.WIRE),
          filter(() => pin.helperEnabled)
        )
        .subscribe(() => {
          helper.opacity(1);
        });

      element.subscriptions.add(mouseMove$);

      const mouseOut$ = fromEvent<React.MouseEvent>(helper.node, 'mouseout')
        .pipe(
          filter(() => this.boardState === BOARD_STATES_ENUM.EDIT || this.boardState === BOARD_STATES_ENUM.WIRE),
          filter(() => pin.helperEnabled)
        )
        .subscribe(() => {
          helper.opacity(0);
        });

      element.subscriptions.add(mouseOut$);
    });
  }

  private static startWire(e: React.MouseEvent): void {
    e.preventDefault();

    const [mouseX, mouseY] = this.getCoords(e);
    const [x, y] = this.calcCoords(mouseX, mouseY);

    this.coords.x1 = x;
    this.coords.y1 = y;
  }

  private static correctWireOrientation(x1: number, y1: number, x2: number, y2: number) {
    if (x1 === x2) {
      x1++;
      x2++;

      if (y1 < y2) {
        y2 += 2;
      } else {
        y1 += 2;
      }
    } else if (y1 === y2) {
      y1++;
      y2++;

      if (x1 < x2) {
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

    const {x1, y1, x2, y2} = this.coords;
    const plot = this.wiresToBuildModels.main ? this.wiresToBuildModels.main.plot() : null;

    this.mouseStart = {x: x1, y: y1};
    this.mouseEnd = {x: x2, y: y2};

    if (this.wiresToBuildModels.main) {
      this.wiresToBuildModels.main.remove();
    }

    if (this.wiresToBuildModels.bend) {
      this.wiresToBuildModels.bend.remove();
    }

    if (y1 !== y2 && x1 !== x2) {
      let x1m, y1m, x2m, y2m;
      let x1b, y1b, x2b, y2b;

      if (plot && plot[0][0] === plot[1][0]) {
        [x1m, y1m, x2m, y2m] = [x1, y1, x1, y2];
        [x1b, y1b, x2b, y2b] = [x1, y2, x2, y2];
      } else {
        [x1m, y1m, x2m, y2m] = [x1, y1, x2, y1];
        [x1b, y1b, x2b, y2b] = [x2, y1, x2, y2];
      }
      [x1m, y1m, x2m, y2m] = this.correctWireOrientation(x1m, y1m, x2m, y2m);
      [x1b, y1b, x2b, y2b] = this.correctWireOrientation(x1b, y1b, x2b, y2b);

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
      const [x1m, y1m, x2m, y2m] = this.correctWireOrientation(x1,y1,x2,y2);

      this.wiresToBuildModels = {
        main: Renderer.createWireGhost(x1m, y1m, x2m, y2m),
        bend: null
      };

      this.wiresToBuildCoords = {
        main: {
          x1: x1m,
          y1: y1m,
          x2: x2m,
          y2: y2m
        },
        bend: null,
      };
    }
  }

  private static prolongWire(wireToProlong: Wire, x1: number, y1: number, x2: number, y2: number): Wire | null {
    const [{x: x1w, y: y1w}, {x: x2w, y: y2w}] = wireToProlong.positionData.coords;
    const prolong = (x1: number, y1: number, x2: number, y2: number) => {
      if (!(wireToProlong.modelData.model instanceof Line)) {
        return;
      }

      wireToProlong.modelData.model.plot(x1, y1, x2, y2);
      wireToProlong.helpers[0].model.x(x1 - 5).y(y1 - 5);
      wireToProlong.helpers[1].model.x(x2 - 5).y(y2 - 5);

      const isFirstBorderJunctionEnabled = wireToProlong.junctionHelpers[0].isEnabled;
      const isLastBorderJunctionEnabled = wireToProlong.junctionHelpers[wireToProlong.junctionHelpers.length - 1].isEnabled;

      wireToProlong.resetJunctionHelpers();
      wireToProlong.junctionHelpers = Renderer.getJunctionHelpers(x1, y1, x2, y2);

      if (isFirstBorderJunctionEnabled) {
        wireToProlong.toggleHelper(wireToProlong.junctionHelpers[0]);
      }

      if (isLastBorderJunctionEnabled) {
        wireToProlong.toggleHelper(wireToProlong.junctionHelpers[wireToProlong.junctionHelpers.length - 1]);
      }

      this.applyJunctionHelpers(wireToProlong);
    };

    if (!(wireToProlong.modelData.model instanceof Line)) {
      return null;
    }

    if (x1w === x2) {
      const minY = Math.min(y1, y2, y1w, y2w);
      const maxY = Math.max(y1, y2, y1w, y2w);

      if (y1w > y2w) {
        prolong(x1, maxY, x2, minY);
      } else {
        prolong(x1, minY, x2, maxY);
      }

      return wireToProlong;
    } else if (y1w === y2) {
      const minX = Math.min(x1, x2, x1w, x2w);
      const maxX = Math.max(x1, x2, x1w, x2w);

      if (x1w > x2w) {
        prolong(maxX, y1, minX, y2);
      } else {
        prolong(minX, y1, maxX, y2);
      }

      return wireToProlong;
    }

    return null;
  }

  private static drawWire(e: React.MouseEvent): void {
    e.preventDefault();

    if (this.wiresToBuildCoords.main) {
      const {x1, y1, x2, y2} = this.wiresToBuildCoords.main;
      const mainOrientation = x1 === x2 ? ORIENTATION.VERTICAL : ORIENTATION.HORIZONTAL;
      let main;

      if (
        Math.abs(Math.pow(x1 - x2, 2) - Math.pow(y1 - y2, 2)) < 12
        || !this.wireData.start
        || (this.wireData.start && this.wireData.end && this.wireData.end.element.id === this.wireData.start.element.id)
      ) {
        return;
      }

      if (
        this.wireData.start.element instanceof Wire
        && mainOrientation === this.wireData.start.element.positionData.orientation
        && !this.wireData.start.isJunction
      ) {
        const {element} = this.wireData.start;
        const newWire = this.prolongWire(element, x1, y1, x2, y2);

        if (newWire) {
          main = newWire;
        }
      } else {
        main = Renderer.createWire(x1, y1, x2, y2);

        main.id = `${main.name} ${this.idCounter}`;
        this.applyWireHelpers(main);
        main.initialize();

        const {element, pin, isJunction} = this.wireData.start;
        const {x, y} = this.mouseStart;

        if (isJunction && element instanceof Wire) {
          element.junctions.push(Renderer.createJunction(x + 1, y + 1, element.getStateColor(element.value)));
        }

        main.wireTo(element, pin, isJunction);

        if (this.wireData.end && !this.wiresToBuildCoords.bend) {
          const {element, pin, isJunction} = this.wireData.end;
          const {x, y} = this.mouseEnd;

          if (isJunction && element instanceof Wire) {
            element.junctions.push(Renderer.createJunction(x + 1, y + 1, element.getStateColor(element.value)));
          }

          main.wireTo(element, pin, isJunction);
        }

        this.wiresList.push(main);
        this.idCounter++;
      }

      if (this.wiresToBuildCoords.bend) {
        const {x1, y1, x2, y2} = this.wiresToBuildCoords.bend;
        const bend = Renderer.createWire(x1, y1, x2, y2);

        bend.id = `${bend.name} ${this.idCounter}`;
        this.applyWireHelpers(bend);
        bend.initialize();

        if (main) {
          main.wireTo(bend);
        }

        if (this.wireData.end) {
          const {element, pin, isJunction} = this.wireData.end;

          const {x, y} = this.mouseEnd;

          if (isJunction && element instanceof Wire) {
            element.junctions.push(Renderer.createJunction(x + 1, y + 1, element.getStateColor(element.value)));
          }

          bend.wireTo(element, pin, isJunction);
        }

        this.wiresList.push(bend);
        this.idCounter++;
      }
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
    element.initialize();
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
              this.drawWire(e);

              if (this.wiresToBuildModels.main) {
                this.wiresToBuildModels.main.remove();
              }

              if (this.wiresToBuildModels.bend) {
                this.wiresToBuildModels.bend.remove();
              }

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
