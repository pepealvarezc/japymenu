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
    ? "https://0d00-189-128-161-72.ngrok-free.app/print"
    : "https://0d00-189-128-161-72.ngrok-free.app/print/bill";
  return axios.post(url, {
    table: order?.table,
    number: `M${order.table}-${String(order.id || "")
      .slice(-4)
      .toUpperCase()}`,
    elements,
  });
};
