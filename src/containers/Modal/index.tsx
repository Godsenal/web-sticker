import React from 'react';
import { createPortal } from 'react-dom';
import ModalFactory from './ModalFactory';

const modalRoot: HTMLElement | null = document.getElementById('modal-root');
export interface ModalProps {
  children: React.ReactChild;
  handleClose: () => void;
  show: boolean;
}
export default class Modal extends React.Component<ModalProps> {
  private _modal: HTMLDivElement;
  constructor(props: any) {
    super(props);
    this._modal = document.createElement('div');
  }
  componentDidMount() {
    if (modalRoot) {
      modalRoot.appendChild(this._modal);
    }
  }
  componentWillUnmount() {
    if (modalRoot) {
      modalRoot.removeChild(this._modal);
    }
  }
  render() {
    const { show, children, ...props } = this.props;
    if (!show) {
      return null;
    }
    return createPortal(
      <ModalFactory {...props}>
        {children}
      </ModalFactory>,
      this._modal,
    );
  }
}
