import {fromEvent, Subscription} from 'rxjs';
import Renderer from './renderer';
import {BOARD_STATES_ENUM, BoardState} from '../types/consts/boardStates.consts';
import {Element} from '@svgdotjs/svg.js';
import {DcbElement} from '../elements/dcbElement';
import React from 'react';
import * as _ from 'lodash';

export class BoardInteractor {
  private static eventSubscription = new Subscription();
  private static svg: SVGSVGElement;
  private static ghost: Element | null;
  private static currentElement: DcbElement | null;
  private static elementsList: Array<DcbElement> = [];
  private static idCounter = 0;
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

  private static createElement(e: React.MouseEvent): void {
    e.preventDefault();

    if (!this.currentElement) {
      return;
    }

    const element = _.cloneDeep(this.currentElement);

    Renderer.createElement(element, this.coords.x1, this.coords.y1);

    element.id = `${element.name} ${this.idCounter}`;

    this.idCounter++;
    this.elementsList.push(element);


    console.log(this.elementsList);
  }

  private static applySubscriptions(...args: Array<Subscription>): void {
    _.forEach(args, subscription => {
      this.eventSubscription.add(subscription);
    });
  }

  public static setState(boardState: BoardState, element: DcbElement | null): void {
    this.resetBoardFields();
    this.currentElement = element;

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
      default:
        break;
    }
  }
}
