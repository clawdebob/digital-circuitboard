import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {RootState} from '../../types/consts/states.consts';
import {BoardState} from '../../types/consts/boardStates.consts';
import './board.scss';
import {DcbElement} from '../../elements/dcbElement';
import Renderer from '../../utils/renderer';
import {fromEvent, Observable, of, Subscription} from 'rxjs';
import {pluck, switchMap} from 'rxjs/operators';

export interface BoardProps {
  boardState: BoardState,
  currentElement: DcbElement | null,
}

const Board = (props: BoardProps) => {
  console.log(props.currentElement);
  const boardWrapper = useRef<HTMLDivElement>(null);
  const boardContainer = useRef<HTMLDivElement>(null);
  const zoomObservable = useRef<Subscription | null>(null);

  useEffect(() => {
    if (boardWrapper.current && boardContainer.current && !Renderer.board) {
      Renderer.init(boardWrapper.current as HTMLElement);

      const wheelHandler$ = fromEvent(boardContainer.current, 'wheel');

      fromEvent(document, 'keydown')
        .pipe(
          pluck('key'),
        ).subscribe(key => {
          if (key === 'Control') {
            zoomObservable.current = wheelHandler$.subscribe(e => {
              e.preventDefault();
            });
          }
        });

      fromEvent(document, 'keyup')
        .pipe(
          pluck('key'),
        ).subscribe(key => {
          if (key === 'Control' && zoomObservable.current) {
            zoomObservable.current.unsubscribe();
            zoomObservable.current = null;
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
