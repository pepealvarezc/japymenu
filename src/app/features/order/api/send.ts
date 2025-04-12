import axios from "axios";
import { Order } from "@/types/order";
import omit from "lodash/omit";

export const send = (
  id: string,
  order: Order
): Promise<{ success: boolean; id: string }> => {
  axios.post(
    "https://0d00-189-128-161-72.ngrok-free.app/print",
    {
      table: order?.table,
      number: `M${order.table}-${String(id || "")
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
    url: `/api/orders/${id}`,
    method: "POST",
    data: {
      data: {
        ...order,
        elements: order.elements?.map((item) => omit(item, ["recentlyAdded"])),
      },
    },
  }).then((r) => r.data);
};
