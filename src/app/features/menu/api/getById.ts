import axios from "axios";
import { Menu } from "@/types/menu";

export const getMenuItem = (
  id: string
): Promise<{ success: boolean; result: Menu }> => {
  return axios({
    url: `/api/menu/${id}`,
    method: "GET",
  }).then((r) => r.data);
};
