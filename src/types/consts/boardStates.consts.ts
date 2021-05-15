import {DcbElement} from '../../elements/dcbElement';
import {OptionsMap} from '../menuCache.type';

export enum BOARD_STATES_ENUM {
  WIRE = 'wire',
  EDIT = 'edit',
  CREATE = 'create',
  INTERACT = 'interact',
  LOADING_DATA = 'lading-data',
  MODELING_DISABLED = 'modeling-disabled'
}

export type BoardState = BOARD_STATES_ENUM.WIRE
  | BOARD_STATES_ENUM.EDIT
  | BOARD_STATES_ENUM.CREATE
  | BOARD_STATES_ENUM.INTERACT
  | BOARD_STATES_ENUM.LOADING_DATA
  | BOARD_STATES_ENUM.MODELING_DISABLED;

export interface StoreBoardState {
  boardState: BoardState,
  currentElement: DcbElement | null,
  propsCache: OptionsMap,
}
