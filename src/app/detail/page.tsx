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
  CircularProgress,
} from "@mui/material";
import { getActiveOrders } from "../features/order/api/list";
import { useEffect } from "react";
import { Order } from "@/types/order";
import { useOrder } from "../context/OrderContext";

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

  const OrderCard = ({ item, key }: { item: Order; key: string }) => (
    <Paper
      elevation={4}
      key={key}
      sx={{
        p: 2,
        borderRadius: 3,
        width: "90%",
        textAlign: "start",
        maxHeight: "50vh",
        overflowY: "auto",
      }}
    >
      <Grid size={{ xs: 12 }}>
        <Stack spacing={0.5}>
          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Chip
              label={item.active ? "Abierta" : "Cerrada"}
              size="small"
              sx={{
                fontWeight: "bold",
                borderRadius: "12px",
                backgroundColor: item.active
                  ? "rgb(61,162,44)"
                  : "rgb(209,15,23)",
                color: "#fff",
                minWidth: 100,
              }}
            />
          </Box>
          <Typography fontWeight="bold" fontSize={16}>
            {`No. M${item.table}-${(item._id || "").slice(-4).toUpperCase()}`}
          </Typography>
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
            disabled={!item.active}
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
      sx={{ minHeight: "70vh", position: "relative" }}
    >
      {orders.length ? (
        <Grid
          container
          size={{ xs: 12 }}
          spacing={4}
          justifyContent="center"
          sx={{ minHeight: "60vh", maxHeight: "70vh", overflowY: "auto" }}
        >
          {orders
            .sort((a, b) => {
              if (a.active !== b.active) {
                return a.active ? -1 : 1;
              }

              return (
                new Date(b.createdAt || "").getTime() -
                new Date(a.createdAt || "").getTime()
              );
            })
            .map((order) => (
              <OrderCard item={order as Order} key={order._id || ""} />
            ))}
        </Grid>
      ) : (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      )}
      <Grid
        size={{ xs: 12 }}
        sx={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "white",
          zIndex: 1,
          width: "100%",
          px: 4,
          pt: 2,
        }}
      >
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
