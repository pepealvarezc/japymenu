import { Order } from "@/types/order";
import axios from "axios";

export const finishOrder = (
  id: string,
  order: Order
): Promise<{ success: boolean; id: string }> => {
  axios.post("https://0d00-189-128-161-72.ngrok-free.app/print/bill", {
    table: order?.table,
    number: `M${order.table}-${String(order._id || "")
      .slice(-4)
      .toUpperCase()}`,
    elements: order?.elements || [],
  });
  return axios({
    url: `/api/orders/finish/${id}`,
    method: "POST",
  }).then((r) => r.data);
};
