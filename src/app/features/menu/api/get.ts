import axios from "axios";
import { Menu } from '@/types/menu'

export const getMenu = () : Promise<{ success: boolean; result: Menu[]}> => {
  return axios({
    url: "/api/menu",
    method: "GET",
  }).then((r) => r.data);
};
