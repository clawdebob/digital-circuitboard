import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {RootState} from '../../types/consts/states.consts';
import {BoardState} from '../../store/consts/boardStates.consts';
import './board.scss';
import {DcbElement} from '../../elements/dcbElement';
import Renderer from '../../utils/renderer';
import {BoardInteractor} from './interaction/board-interactor';

export interface BoardProps {
  boardState: BoardState,
  currentElement: DcbElement | null,
}

const Board = (props: BoardProps) => {
  const boardWrapper = useRef<HTMLDivElement>(null);
  const boardContainer = useRef<HTMLDivElement>(null);
  // const zoom = useRef<number>(100);

  useEffect(() => {
    if (boardWrapper.current && boardContainer.current && !Renderer.board) {
      BoardInteractor.init(boardWrapper.current as HTMLElement);

      // fromEvent<React.WheelEvent>(boardContainer.current, 'wheel')
      //   .pipe(
      //     filter(e => e.ctrlKey)
      //   ).subscribe(e => {
      //     if (!boardContainer.current) {
      //       return;
      //     }
      //
      //     e.preventDefault();
      //
      //     const {top, left} = boardContainer.current.getBoundingClientRect();
      //
      //     const zoomStep = e.deltaY < 0 ? 10 : -10;
      //     const nextZoomVal = zoom.current + zoomStep;
      //
      //     if (nextZoomVal >= 20 && nextZoomVal <= 200) {
      //       zoom.current = nextZoomVal;
      //       Renderer.setBoardZoom(zoom.current, e.pageX, e.pageY);
      //     }
      //   });
    }
  });

  BoardInteractor.setState(props.boardState, props.currentElement);

  return (
    <div
      className="board__container"
      ref={boardContainer}
      onMouseLeave={BoardInteractor.hideGhosts.bind(BoardInteractor)}
    >
      <div
        ref={boardWrapper}
        className={`board board--${props.boardState}`}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  boardState: state.board.boardState,
  currentElement: state.board.currentElement
});

export default connect(mapStateToProps)(Board);
