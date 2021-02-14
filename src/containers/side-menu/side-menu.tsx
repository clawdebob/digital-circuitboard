import React, {useEffect, useRef} from 'react';
import GroupsList from './controls/groups-list/groups-list';
import _ from 'lodash';
import {fromEvent} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import './side-menu.scss';
import ElementDetails from './controls/element-details/element-details';

interface Slider {
  column: HTMLElement | null,
  curColumnWidth: number,
  pageX: number,
  width: number,
  height: number,
}

const SideMenu = (): React.ReactElement => {
  const menuRef = useRef<HTMLDivElement>(null);
  const menuInitialWidth = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement> & React.ChangeEvent<HTMLDivElement>) => {
    e.preventDefault();

    const slider = {
      column: e.target.parentElement,
      curColumnWidth: _.get(e, 'target.parentElement.offsetWidth', 0),
      pageX: e.pageX,
      width: e.target.offsetWidth + 2,
      height: e.target.offsetHeight
    };

    const sliderResize$ = fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(
        map((e: MouseEvent) => handleMouseMove(e, slider)),
        switchMap(() => fromEvent(document, 'mouseup')),
      ).subscribe(() => {
        sliderResize$.unsubscribe();
      });
  };

  const handleMouseMove = (e: MouseEvent, slider: Slider) => {
    e.preventDefault();

    const diffX = e.pageX - slider.pageX;
    const menuWidth = diffX + slider.curColumnWidth;

    if (menuInitialWidth.current > menuWidth) {
      menuInitialWidth.current = menuWidth;
    }

    if(!slider.column) {
      return;
    }

    if (e.pageX > slider.width && slider.column.getBoundingClientRect().width > slider.width) {
      slider.column.style.width = `${menuWidth}px`;
    } else {
      slider.column.style.width = `${slider.width}px`;
    }
    console.log('mousemove');
  };

  useEffect(() => {
    if (menuRef.current) {
      menuInitialWidth.current = menuRef.current.getBoundingClientRect().width;
    }


  });

  return (
    <div
      className="side-menu"
      ref={menuRef}
    >
      <div className="side-menu__section__wrapper">
        <div className="side-menu__section">
          <GroupsList
            className="side-menu__section__list"
          />
          <ElementDetails className={'element-details'}/>
        </div>
      </div>
      <div
        className="side-menu__split-bar"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default SideMenu;
