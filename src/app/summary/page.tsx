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
  Grid,
} from "@mui/material";
import {
  Add,
  Remove,
  DeleteOutline,
  Print,
  KeyboardReturn,
} from "@mui/icons-material";
import { useOrder } from "../context/OrderContext";
import { send } from "../features/order/api/send";
import { enqueueSnackbar } from "notistack";
import { printOrder } from "../features/order/api/print";
import { finishOrder } from "../features/order/api/finish";
import { updateItems } from "../features/order/api/update-items";

type Props = {
  name: string;
  description: string;
  quantity: number;
  amount: number;
  onAdd: () => void;
  onRemove: () => void;
  isActive: boolean;
  canEdit: boolean;
};

const OrderItem = ({
  name,
  description,
  quantity,
  amount,
  onAdd,
  onRemove,
  isActive,
  canEdit,
}: Props) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 3,
        maxHeight: 130,
        minHeight: 130,
        textAlign: "start",
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      <Grid container direction="row" size={{ xs: 12 }}>
        <Grid size={{ xs: 8 }}>
          <Typography variant="h6" fontWeight="bold" mt={1}>
            ${amount.toFixed(2)}
          </Typography>
        </Grid>
        <Grid size={{ xs: 4 }} sx={{ mt: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            gap={1}
          >
            <IconButton
              onClick={onRemove}
              sx={{ bgcolor: "#f5f5f5", "&:hover": { bgcolor: "#e0e0e0" } }}
              disabled={!isActive || !canEdit}
              size="small"
            >
              {quantity > 1 ? <Remove /> : <DeleteOutline />}
            </IconButton>
            <Typography>{quantity}</Typography>
            <IconButton
              onClick={onAdd}
              size="small"
              sx={{
                "&:hover": { bgcolor: "error.dark" },
                borderColor: "rgb(209,15,23)",
                backgroundColor: "rgb(209,15,23)",
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
              }}
              disabled={!isActive || !canEdit}
            >
              <Add />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

const OrderSummary = () => {
  const router = useRouter();

  const { order, setOrder } = useOrder();

  if (!order.id) {
    router.push("/");
  }

  const handleFinishOrder = async (id: string) => {
    await finishOrder(id, order);
    enqueueSnackbar("Orden Cerrada", {
      variant: "success",
      onExit: () => {
        setOrder({});
        router.push("/");
      },
    });
  };

  const items = (order.elements || [])
    .filter((e) => {
      if (order.elements?.some((r) => r.recentlyAdded)) {
        return e.recentlyAdded;
      }
      return true;
    })
    .map((r) => {
      if (order.elements?.some((r) => r.recentlyAdded)) {
        return r;
      }
      return {
        ...r,
        recentlyAdded: true,
      };
    });

  if (!items?.length) {
    router.push("/menu");
  }

  const total = sumBy(items, "price");

  const handleAddItem = (itemId: string) => {
    const orderItems = order?.elements || [];
    const item = orderItems?.find((i) => i._id === itemId);
    if (item) {
      orderItems?.push({
        ...item,
        recentlyAdded: true,
      });
      setOrder({
        ...order,
        elements: orderItems,
      });
    }
  };

  const handleDeleteItem = (itemId: string) => {
    const orderItems = order?.elements || [];
    const index = orderItems?.findLastIndex((item) => item._id === itemId);
    if (index !== undefined && index !== -1) {
      orderItems?.splice(index, 1);
      setOrder({
        ...order,
        elements: orderItems,
      });
    }
  };

  const itemsGrouped = groupBy(
    items?.sort((a, b) => a.name.localeCompare(b.name)),
    "_id"
  );

  const canFinishOrder =
    order.sended && (order.elements || []).every((e) => !e.recentlyAdded);

  const handleSendOrder = async () => {
    if (order && order.id && !order.sended) {
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
    if (order && order.id && order.sended && canFinishOrder) {
      handleFinishOrder(order.id);
    }

    if (order && order.id && order.sended && !canFinishOrder) {
      printOrder(order, items);
      await updateItems(order.id || "", order.elements || []);
      enqueueSnackbar("Orden Actualizada", {
        variant: "success",
        onExit: () => {
          setOrder({});
          router.push("/");
        },
      });
    }
  };

  return (
    <Box p={2}>
      <Grid
        size={{ xs: 12 }}
        sx={{
          maxHeight: "50vh",
          minHeight: "50vh",
          overflowY: "auto",
          position: "relative",
        }}
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
              isActive={order.active || false}
              canEdit={!(order.elements || []).every((e) => !e.recentlyAdded)}
            />
          );
        })}
      </Grid>
      <Grid
        size={{ xs: 12 }}
        spacing={2}
        sx={{
          mt: 4,
          position: "sticky",
          bottom: 0,
          backgroundColor: "white",
          zIndex: 1,
          width: "100%",
          pt: 2,
        }}
      >
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 3,
              textAlign: "start",
              mb: 4,
              width: "100%",
            }}
          >
            <Grid container size={{ xs: 12 }}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="h6" fontWeight="bold" color="error.main">
                  Total:
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="h6" fontWeight="bold" textAlign="right">
                  ${total.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="column" size={{ xs: 12 }}>
              <Typography variant="body2">
                Comida:{" "}
                {order.elements?.filter((i) => i.type === "Comida").length || 0}{" "}
                platillos
              </Typography>
              <Typography variant="body2" mb={1}>
                Bebidas:{" "}
                {order.elements?.filter((i) => i.type === "Bebida").length || 0}{" "}
                bebidas
              </Typography>
            </Grid>
          </Paper>
        </Grid>
        <Grid
          container
          size={{ xs: 12 }}
          direction="row"
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid size={{ xs: 3 }} sx={{ textAlign: "start" }}>
            <IconButton
              size="large"
              sx={{
                borderRadius: 999,
                fontWeight: "bold",
                borderColor: "rgb(209,15,23)",
                backgroundColor: "rgb(209,15,23)",
                color: "white",
              }}
              onClick={() => {
                if (order.sended) {
                  return router.push("/");
                }
                return router.push("/menu");
              }}
            >
              <KeyboardReturn />
            </IconButton>
          </Grid>
          <Grid size={{ xs: 3 }} sx={{ textAlign: "start" }}>
            <IconButton
              color="error"
              size="large"
              sx={{
                borderRadius: 999,
                fontWeight: "bold",
                borderColor: "rgb(209,15,23)",
                backgroundColor: "rgb(209,15,23)",
                color: "white",
              }}
              onClick={() => router.push("/menu")}
              disabled={!order.active}
            >
              <Add />
            </IconButton>
          </Grid>
          <Grid size={{ xs: 3 }} sx={{ textAlign: "start" }}>
            <IconButton
              size="large"
              sx={{
                borderRadius: 999,
                fontWeight: "bold",
                borderColor: "rgb(209,15,23)",
                backgroundColor: "rgb(209,15,23)",
                color: "white",
              }}
              disabled={!order.sended}
              onClick={async () => {
                printOrder(order, items);
              }}
            >
              <Print />
            </IconButton>
          </Grid>
          <Grid size={{ xs: 3 }} sx={{ textAlign: "start" }}>
            <Button
              variant="contained"
              size="small"
              fullWidth
              sx={{
                borderColor: "rgb(209,15,23)",
                backgroundColor: "rgb(209,15,23)",
                color: "white",
                borderRadius: 10,
                padding: 1,
                minWidth: 100,
                fontWeight: "bold",
                fontSize: "18px",
                textTransform: "none",
              }}
              disabled={
                !order?.elements?.length || !order.active || !order.active
              }
              onClick={handleSendOrder}
            >
              {canFinishOrder ? "Cuenta" : "Enviar"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderSummary;
