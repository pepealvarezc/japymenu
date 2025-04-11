import axios from "axios";

export const finishOrder = (
  id: string,
): Promise<{ success: boolean; id: string }> => {
  return axios({
    url: `/api/orders/finish/${id}`,
    method: "POST",
  }).then((r) => r.data);
};
