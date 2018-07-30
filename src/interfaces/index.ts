export interface ISticker {
  id: number;
  contents: string;
  top: number;
  left: number;
  width: number;
  height: number;
  fontSize: number;
  backgroundColor: string;
}

export interface IUser {
  username: string;
  stickers: ISticker[];
  theme: string;
}