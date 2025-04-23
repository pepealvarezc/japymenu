import axios from "axios";
import { Order } from "@/types/order";
import { Payment } from "@/types/payments";

type Params = {
  order: Order;
  payments: Payment[];
};

export const printByOrder = ({ order, payments }: Params) => {
  axios.post(
    "https://23ce-189-128-3-106.ngrok-free.app/print/payments",
    {
      table: order?.table,
      number: `M${order.table}-${String(order._id || "")
        .slice(-4)
        .toUpperCase()}`,
      payments,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};
