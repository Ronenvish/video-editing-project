export type Scene = {
  id: string;
  name: string;
  duration: number;
  url: string;
  selected: boolean;
};

export type RulerStatus =
  | 'Initial'
  | 'Play'
  | 'Resume'
  | 'Pause'
  | 'Replay'
  | 'Finished'
  | 'SingleVideo'
  | 'CustomPosition';
