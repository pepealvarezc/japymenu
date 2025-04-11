"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { Grid, Button, TextField, Autocomplete } from "@mui/material";
import { useOrder } from "@/app/context/OrderContext";
import { getTables } from "@/app/features/table/api/get";
import { Table } from "@/types/table";
import { createOrder } from "@/app/features/order/api/create";
import { Order } from "@/types/order";
import { getActiveOrders } from "../features/order/api/list";

const Home = () => {
  const router = useRouter();
  const { order, setOrder } = useOrder();
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const handleGetActiveOrders = async () => {
    const response = await getActiveOrders().catch(() => null);
    if (response) {
      setOrders(response.result);
    }
  };

  useEffect(() => {
    handleGetActiveOrders();
  }, []);

  const handleGetTables = async () => {
    const response = await getTables().catch(() => null);
    if (response) {
      setTables(response.result);
    }
  };

  useEffect(() => {
    handleGetTables();
  }, []);

  const handleCreateOrder = async () => {
    if (!order.name || !order.table) {
      enqueueSnackbar("No se ha seleccionado una mesa", { variant: "error" });
    } else {
      const response = await createOrder({
        name: order.name,
        table: order.table,
        notes: order.notes,
      });

      setOrder({ ...order, id: response.id, active: true });
      router.push("/menu");
    }
  };

  return (
    <Grid
      container
      spacing={5}
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "70vh", position: "relative" }}
    >
      <Grid container size={{ xs: 12 }}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Tu nombre"
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: { borderRadius: 5, boxShadow: 2 } }}
            onChange={(e) => setOrder({ ...order, name: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Autocomplete
            options={tables.map((table) => table.number)}
            value={order.table}
            onChange={(event, newValue) => {
              setOrder({ ...order, table: newValue ?? "" });
            }}
            getOptionDisabled={(option) =>
              !!orders.find((o) => String(o.table) === option && o.active)
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 5,
                boxShadow: 2,
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Mesa"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Notas"
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: { borderRadius: 5, boxShadow: 2 } }}
            onChange={(e) => setOrder({ ...order, notes: e.target.value })}
          />
        </Grid>
      </Grid>
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
          onClick={handleCreateOrder}
          disabled={!order.name || !order.table}
        >
          Siguiente
        </Button>
      </Grid>
    </Grid>
  );
};

export default Home;
