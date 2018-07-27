import React from 'react';

export interface ISticker {
  id: number;
  contents: string;
  top: number;
  left: number;
  width?: number;
  height?: number;
}