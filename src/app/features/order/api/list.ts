import { Order } from "@/types/order";
import axios from "axios";

export const getActiveOrders = (): Promise<{
  success: boolean;
  result: Order[];
}> => {
  return axios({
    url: "/api/orders",
    method: "GET",
  }).then((r) => r.data);
};
