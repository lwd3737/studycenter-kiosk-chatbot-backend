import { PresetRoom } from './preset.schema';

export const PRESET_ROOMS: PresetRoom[] = [
  {
    id: 'room1',
    title: '열람실-1',
    type: 'READING_ROOM',
    number: 1,
  },
  {
    id: 'room2',
    title: '열람실-2',
    type: 'READING_ROOM',
    number: 2,
  },
  {
    id: 'room3',
    title: '열람실-3',
    type: 'READING_ROOM',
    number: 3,
  },
  {
    id: 'room4',
    title: '스터디카페-1',
    type: 'CAFE',
    number: 4,
  },
  {
    id: 'room5',
    title: '스터디카페-2',
    type: 'CAFE',
    number: 5,
  },
  {
    id: 'room6',
    title: 'VIP 룸',
    type: 'VIP_ROOM',
    number: 6,
  },
];
