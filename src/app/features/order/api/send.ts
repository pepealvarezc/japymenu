import axios from "axios";
import { Order } from "@/types/order";

export const send = (
  id: string,
  order: Order
): Promise<{ success: boolean; id: string }> => {
  return axios({
    url: `/api/orders/${id}`,
    method: "POST",
    data: {
      data: order,
    },
  }).then((r) => r.data);
};
