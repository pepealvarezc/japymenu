import type { Menu } from "./menu";

export type Order = {
  id?: string;
  _id?: string;
  name?: string;
  table?: string;
  notes?: string;
  elements?: Menu[];
  createdAt?: string;
  sended?: boolean;
};

export type CreationData = {
  name: string;
  table: string;
  notes?: string;
};
