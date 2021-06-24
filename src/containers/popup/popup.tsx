import React from 'react';
import './popup.scss';

interface PopupProps {
  close: () => void;
  isVisible: boolean;
}

const Popup = (props: React.PropsWithChildren<PopupProps>): React.ReactElement | null =>
  props.isVisible ? (
    <div
      className="fade-curtain"
    >
      <div className="popup">
        <span
          className="close"
          onClick={props.close}
        >
          ✕
        </span>
        {props.children}
      </div>
    </div>
  ) : null;

export default Popup;
