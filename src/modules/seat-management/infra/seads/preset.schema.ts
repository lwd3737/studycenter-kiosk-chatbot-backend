export type PresetRoom = {
  id: string;
  title: string;
  type: string;
  number: number;
};

export type PresetSeat = {
  id: string;
  roomId: string;
  number: number;
};
