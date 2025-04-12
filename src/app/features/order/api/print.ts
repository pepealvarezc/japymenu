import { Menu } from "@/types/menu";
import axios from "axios";
import { Order } from "@/types/order";

export const printOrder = (
  order: Order,
  elements: Menu[]
): Promise<{ success: boolean; id: string }> => {
  // return axios({
  //   url: `/api/orders/print/${id}`,
  //   data: { elements },
  //   method: "POST",
  // }).then((r) => r.data);
  const url = order.active
    ? "http://192.168.68.125:3000/print"
    : "http://192.168.68.125:3000/print/bill";
  return axios.post(url, {
    table: order?.table,
    number: `M${order.table}-${String(order.id || "")
      .slice(-4)
      .toUpperCase()}`,
    elements,
  });
};
