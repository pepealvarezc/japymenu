import { Menu } from "@/types/menu";
import axios from "axios";

export const printOrder = (
  id: string,
  elements: Menu[]
): Promise<{ success: boolean; id: string }> => {
  return axios({
    url: `/api/orders/print/${id}`,
    data: { elements },
    method: "POST",
  }).then((r) => r.data);
};
