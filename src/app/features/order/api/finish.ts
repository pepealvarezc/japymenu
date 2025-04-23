import { Order } from "@/types/order";
import axios from "axios";

export const finishOrder = async (
  id: string,
  order: Order
): Promise<{ success: boolean; id: string }> => {
  await axios.post(
    `https://23ce-189-128-3-106.ngrok-free.app/print/bill`,
    {
      id: order._id,
      table: order?.table,
      mesero: order.name,
      notes: order.notes,
      number: `M${order.table}-${String(order._id || "")
        .slice(-4)
        .toUpperCase()}`,
      elements: order?.elements || [],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return axios({
    url: `/api/orders/finish/${id}`,
    method: "POST",
  }).then((r) => r.data);
};
