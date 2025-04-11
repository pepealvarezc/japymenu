import axios from "axios";

export const printOrder = (id: string): Promise<{ success: boolean; id: string }> => {
  return axios({
    url: `/api/orders/print/${id}`,
    method: "POST",
  }).then((r) => r.data);
};
