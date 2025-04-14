"use client";

import { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  CardContent,
  Card,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/navigation";
import { getMenu } from "@/app/features/menu/api/get";
import { Menu } from "@/types/menu";
import { useOrder } from "@/app/context/OrderContext";

export function formatearDinero(numero: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(numero);
}

const Home = () => {
  const router = useRouter();
  const { order } = useOrder();

  const [menu, setMenu] = useState<Menu[]>([]);
  const [originalMenu, setOriginalMenu] = useState<Menu[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | false>(
    false
  );

  const handleGetMenu = async () => {
    setLoading(true);
    const response = await getMenu().catch(() => null);
    if (response) {
      setMenu(response.result);
      setOriginalMenu(response.result);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!menu.length && originalMenu.length === 0) {
      handleGetMenu();
    }
    if (!order.id) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (text.trim() !== "") {
      const filtrado = originalMenu.filter((m) =>
        m.name.toLowerCase().includes(text.toLowerCase())
      );
      setMenu(filtrado);
    } else {
      setMenu(originalMenu);
    }
  }, [text, originalMenu]);

  const groupedByCategory = menu.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menu>);

  const handleAccordionToggle = (category: string) => {
    setExpandedCategory((prev) => (prev === category ? false : category));
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
      <Grid size={{ xs: 12 }} sx={{ width: "100%", px: 2, mt: 2 }}>
        <TextField
          fullWidth
          size="small"
          onChange={(e) => setText(e.target.value)}
          placeholder="Buscar elemento en el menú"
        />
      </Grid>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{
          maxHeight: "70vh",
          minHeight: "70vh",
          overflowY: "auto",
          width: "100%",
        }}
      >
        {!loading && menu.length === 0 ? (
          <Box sx={{ width: "100%", textAlign: "center", mt: 4 }}>
            <Typography variant="body1">No hay coincidencias.</Typography>
          </Box>
        ) : loading ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box p={2} sx={{ width: "100%" }}>
            {Object.entries(groupedByCategory).map(([category, items]) => (
              <Accordion
                key={category}
                expanded={expandedCategory === category}
                onChange={() => handleAccordionToggle(category)}
                sx={{
                  mb: 2,
                  border: "none",
                  boxShadow: "none",
                  "&::before": {
                    display: "none",
                  },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" fontWeight="bold">
                    {category}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {items.map((item) => (
                      <Grid size={{ xs: 6 }} key={item._id}>
                        <Card
                          sx={{
                            borderRadius: 2,
                            boxShadow: 3,
                            height: "100%",
                            transition:
                              "transform 0.2s ease, box-shadow 0.2s ease",
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
                              {formatearDinero(Number(item.price.toFixed(2)))}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
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
