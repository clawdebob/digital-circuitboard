import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {RootState} from '../../types/consts/states.consts';
import {BoardState} from '../../types/consts/boardStates.consts';
import './board.scss';
import {DcbElement} from '../../elements/dcbElement';
import Renderer from '../../utils/renderer';
import {fromEvent, Observable, of, Subscription} from 'rxjs';
import {filter, pluck, skipUntil, skipWhile, switchMap, tap} from 'rxjs/operators';

export interface BoardProps {
  boardState: BoardState,
  currentElement: DcbElement | null,
}

const Board = (props: BoardProps) => {
  console.log(props.currentElement);
  const boardWrapper = useRef<HTMLDivElement>(null);
  const boardContainer = useRef<HTMLDivElement>(null);
  const zoom = useRef<number>(100);

  useEffect(() => {
    if (boardWrapper.current && boardContainer.current && !Renderer.board) {
      Renderer.init(boardWrapper.current as HTMLElement);

      fromEvent<React.WheelEvent>(boardContainer.current, 'wheel')
        .pipe(
          filter(e => e.ctrlKey)
        ).subscribe(e => {
          e.preventDefault();

          const zoomStep = e.deltaY < 0 ? 10 : -10;
          const nextZoomVal = zoom.current + zoomStep;

          if (nextZoomVal >= 20 && nextZoomVal <= 200) {
            zoom.current = nextZoomVal;
            Renderer.setBoardZoom(zoom.current);
          }
        });
    }
  });


  return (
    <div
      className="board__container"
      ref={boardContainer}
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
