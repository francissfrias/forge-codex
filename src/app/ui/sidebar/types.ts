export type RawItem = {
  id: number;
  dname: string;
  qual?: string;
  cost: number;
  img: string;
  tier?: number;
  [key: string]: unknown;
};

export type ItemEntry = { key: string; item: RawItem };

export type CategoryDef = {
  id: string;
  label: string;
  color: string;
  match: (item: RawItem) => boolean;
};
