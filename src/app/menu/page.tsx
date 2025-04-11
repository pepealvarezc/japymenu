"use client";

import { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  CardContent,
  Card,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { getMenu } from "@/app/features/menu/api/get";
import { Menu } from "@/types/menu";
import { useOrder } from "@/app/context/OrderContext";

const Home = () => {
  const router = useRouter();
  const { order } = useOrder();
  const [menu, setMenu] = useState<Menu[]>([]);

  const handleGetMenu = async () => {
    const response = await getMenu().catch(() => null);
    if (response) {
      setMenu(response.result);
    }
  };

  useEffect(() => {
    if (!menu.length) {
      handleGetMenu();
    }
    if (!order.id) {
      router.push("/");
    }
  }, []);

  const groupedByCategory = menu.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menu>);

  return (
    <Grid
      container
      spacing={5}
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "70vh", position: "relative" }}
    >
      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <Box p={2}>
          {Object.entries(groupedByCategory).map(([category, items]) => (
            <Box key={category} mb={4}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                {category}
              </Typography>
              <Grid container spacing={2} justifyContent="start">
                {items.map((item) => (
                  <Grid size={{ xs: 6 }} key={item._id}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        boxShadow: 3,
                        height: "100%",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "scale(0.98)",
                          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => router.push(`/menu/add/${item._id}`)}
                    >
                      <CardContent>
                        <Typography variant="body1" fontWeight="500">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Cantidad: {item.quantity}
                        </Typography>
                        <Typography variant="h6" color="error" mt={1}>
                          ${item.price.toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
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
          disabled={!order?.elements?.length}
          onClick={() => router.push("/summary")}
        >
          Siguiente
        </Button>
      </Grid>
    </Grid>
  );
};

export default Home;
