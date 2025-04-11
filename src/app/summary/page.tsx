"use client";

import React from "react";
import { useRouter } from "next/navigation";
import groupBy from "lodash/groupBy";
import first from "lodash/first";
import sumBy from "lodash/sumBy";
import omit from "lodash/omit";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  Divider,
  Grid,
} from "@mui/material";
import { Add, Remove, DeleteOutline, Print } from "@mui/icons-material";
import { useOrder } from "../context/OrderContext";
import { send } from "../features/order/api/send";
import { enqueueSnackbar } from "notistack";
import { printOrder } from "../features/order/api/print";

type Props = {
  name: string;
  description: string;
  quantity: number;
  amount: number;
  onAdd: () => void;
  onRemove: () => void;
};

const OrderItem = ({
  name,
  description,
  quantity,
  amount,
  onAdd,
  onRemove,
}: Props) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 3,
        maxHeight: 180,
        minHeight: 180,
        textAlign: "start",
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      <Typography variant="h6" fontWeight="bold" mt={1}>
        ${amount.toFixed(2)}
      </Typography>
      <Box
        mt={2}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        gap={1}
      >
        <IconButton
          onClick={onRemove}
          sx={{ bgcolor: "#f5f5f5", "&:hover": { bgcolor: "#e0e0e0" } }}
        >
          {quantity > 1 ? <Remove /> : <DeleteOutline />}
        </IconButton>
        <Typography>{quantity}</Typography>
        <IconButton
          onClick={onAdd}
          sx={{
            "&:hover": { bgcolor: "error.dark" },
            borderColor: "rgb(209,15,23)",
            backgroundColor: "rgb(209,15,23)",
            color: "white",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          <Add />
        </IconButton>
      </Box>
    </Paper>
  );
};

const OrderSummary = () => {
  const router = useRouter();

  const { order, setOrder } = useOrder();

  if (!order.id) {
    router.push("/");
  }
  const items = order.elements;

  if (!items?.length) {
    router.push("/menu");
  }

  const total = sumBy(items, "price");

  const handleAddItem = (itemId: string) => {
    const item = items?.find((i) => i._id === itemId);
    if (item) {
      items?.push(item);
      setOrder({
        ...order,
        elements: items,
      });
    }
  };

  const handleDeleteItem = (itemId: string) => {
    const index = items?.findIndex((item) => item._id === itemId);
    if (index !== undefined && index !== -1) {
      items?.splice(index, 1);
      setOrder({
        ...order,
        elements: items,
      });
    }
  };

  const itemsGrouped = groupBy(
    items?.sort((a, b) => a.name.localeCompare(b.name)),
    "_id"
  );

  const handleSendOrder = async () => {
    if (order && order.id) {
      const response = await send(
        order.id,
        omit(order, ["id", "_id", "sended", "createdAt", "active"])
      ).catch(() => null);
      if (!response) {
        return enqueueSnackbar("No se pudo mandar la comanda", {
          variant: "error",
        });
      }
      return router.push("/submit");
    }
  };

  return (
    <Box p={2}>
      <Grid
        size={{ xs: 12 }}
        sx={{ maxHeight: "50vh", minHeight: "50vh", overflowY: "auto" }}
      >
        {Object.keys(itemsGrouped).map((id) => {
          const itemsById = itemsGrouped[id];
          const item = first(itemsById);
          return (
            <OrderItem
              key={id}
              name={item?.name || ""}
              description={item?.quantity || ""}
              quantity={items?.filter((i) => i._id === item?._id).length || 0}
              amount={item?.price || 0}
              onAdd={() => handleAddItem(id)}
              onRemove={() => handleDeleteItem(id)}
            />
          );
        })}
        <Grid container size={{ xs: 12 }} justifyContent="end">
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{ borderRadius: 999, py: 1.5, fontWeight: "bold", mb: 3 }}
            onClick={() => router.push("/menu")}
          >
            + Agregar
          </Button>
        </Grid>
      </Grid>
      {(order.sended && (
        <Grid container size={{ xs: 12 }} justifyContent="start">
          <Button
            variant="outlined"
            size="small"
            startIcon={<Print />}
            sx={{
              borderRadius: 999,
              py: 1.5,
              fontWeight: "bold",
              mb: 3,
              color: "rgb(209,15,23)",
              borderColor: "rgb(209,15,23)",
            }}
            onClick={() => printOrder(order._id || "")}
          >
            Re-Imprimir Cuenta
          </Button>
        </Grid>
      )) ||
        null}

      <Paper elevation={2} sx={{ p: 2, borderRadius: 3, textAlign: "start" }}>
        <Typography fontWeight="bold" color="error.main">
          Total:
        </Typography>
        <Typography variant="body2">
          Comida: {items?.filter((i) => i.type === "Comida").length || 0}{" "}
          platillos
        </Typography>
        <Typography variant="body2" mb={1}>
          Bebidas: {items?.filter((i) => i.type === "Bebida").length || 0}{" "}
          bebidas
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="h6" fontWeight="bold" textAlign="right">
          ${total.toFixed(2)}
        </Typography>
      </Paper>
      <Grid size={{ xs: 12 }} sx={{ mt: 4 }}>
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
          disabled={!order?.elements?.length}
          onClick={handleSendOrder}
        >
          Enviar Orden
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            borderColor: "rgb(209,15,23)",
            color: "rgb(209,15,23)",
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 2,
            fontWeight: "bold",
            fontSize: "18px",
            textTransform: "none",
          }}
          onClick={() => {
            if (order.sended) {
              return router.push("/");
            }
            return router.push("/menu");
          }}
        >
          Regresar
        </Button>
      </Grid>
    </Box>
  );
};

export default OrderSummary;
