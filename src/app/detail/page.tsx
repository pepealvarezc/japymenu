"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import sumBy from "lodash/sumBy";
import dayjs from "dayjs";
import {
  Grid,
  Button,
  Typography,
  Paper,
  Stack,
  Box,
  Chip,
} from "@mui/material";
import { getActiveOrders } from "../features/order/api/list";
import { useEffect } from "react";
import { Order } from "@/types/order";
import { useOrder } from "../context/OrderContext";
import { finishOrder } from "../features/order/api/finish";

const Home = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const { setOrder } = useOrder();

  const handleGetActiveOrders = async () => {
    const response = await getActiveOrders().catch(() => null);
    if (response) {
      setOrders(response.result);
    }
  };

  useEffect(() => {
    handleGetActiveOrders();
  }, []);

  const handleFinishOrder = async (id: string) => {
    await finishOrder(id);
    router.push("/");
  };

  const OrderCard = ({ item, key }: { item: Order; key: string }) => (
    <Paper
      elevation={4}
      key={key}
      sx={{
        p: 2,
        borderRadius: 3,
        width: "90%",
        textAlign: "start",
        maxHeight: "40vh",
      }}
    >
      <Grid size={{ xs: 12 }}>
        <Stack spacing={0.5}>
          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Chip
              label="Abierta"
              size="small"
              sx={{
                fontWeight: "bold",
                borderRadius: "12px",
                backgroundColor: "rgb(61,162,44)",
                color: "#fff",
                minWidth: 100,
              }}
            />
          </Box>
          <Typography variant="body2">
            Atiende: <strong>{item?.name}</strong>
          </Typography>
          <Typography variant="body2">
            Fecha:{" "}
            {(item?.createdAt &&
              dayjs(item.createdAt).format("DD - MMM - YYYY")) ||
              ""}
          </Typography>
          <Typography variant="body2">
            Hora:{" "}
            {(item?.createdAt && dayjs(item.createdAt).format("hh:mm A")) || ""}
          </Typography>
          <Typography variant="body2">Mesa: {item?.table}</Typography>
          <Typography variant="body2">Notas: {item?.notes || ""}</Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2">
              Total artículos: {item.elements?.length}
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              Total: ${sumBy(item.elements, "price")}
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={1.2} mt={2}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            sx={{ borderRadius: 999, fontWeight: "bold" }}
            onClick={() => {
              setOrder({
                id: item._id,
                ...item,
              });
              router.push("/summary");
            }}
          >
            Ver detalle
          </Button>
          <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{ borderRadius: 999, fontWeight: "bold" }}
            onClick={() => {
              setOrder({
                id: item._id,
                ...item,
              });
              router.push("/menu");
            }}
          >
            Agregar artículos
          </Button>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            sx={{ borderRadius: 999, fontWeight: "bold" }}
            onClick={() => handleFinishOrder(item._id || "")}
          >
            Cerrar cuenta
          </Button>
        </Stack>
      </Grid>
    </Paper>
  );

  return (
    <Grid
      container
      spacing={5}
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "70vh" }}
    >
      <Grid
        container
        size={{ xs: 12 }}
        spacing={4}
        justifyContent="center"
        sx={{ minHeight: "60vh", maxHeight: "60vh", overflowY: "auto" }}
      >
        {orders.map((order) => (
          <OrderCard item={order as Order} key={order._id || ""} />
        ))}
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            borderColor: "rgb(209,15,23)",
            backgroundColor: "rgb(209,15,23)",
            color: "white",
            borderRadius: 20,
            padding: 2,
            fontWeight: "bold",
            fontSize: "18px",
            textTransform: "none",
          }}
          onClick={() => router.push("/")}
        >
          Regresar
        </Button>
      </Grid>
    </Grid>
  );
};

export default Home;
