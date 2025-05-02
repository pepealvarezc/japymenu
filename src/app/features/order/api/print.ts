import { Menu } from "@/types/menu";
import axios from "axios";
import { Order } from "@/types/order";

export const printOrder = (
  order: Order,
  elements: Menu[]
): Promise<{ success: boolean; id: string }> => {
  // return axios({
  //   url: `/api/orders/print/${order.id}`,
  //   data: { elements },
  //   method: "POST",
  // }).then((r) => r.data);
  const url = order.active
    ? `https://b183-189-141-23-34.ngrok-free.app/print`
    : `https://b183-189-141-23-34.ngrok-free.app/print/bill`;
  return axios.post(
    url,
    {
      table: order?.table,
      number: `M${order.table}-${String(order.id || "")
        .slice(-4)
        .toUpperCase()}`,
      elements,
      id: order._id,
      mesero: order.name,
      notes: order.notes,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};
