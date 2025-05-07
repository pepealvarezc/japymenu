"use client";

import { Button, Grid, Paper, Typography } from "@mui/material";
import { handleDownload } from "@/app/features/reporter/api/order";

export default function Page() {
  return (
    <Grid
      container
      spacing={5}
      direction="column"
      justifyContent="start"
      alignItems="start"
      sx={{ minHeight: "70vh", position: "relative", mt: 4 }}
    >
      <Grid container size={{ xs: 12 }}>
        <Grid size={{ xs: 12 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography fontWeight="bold" fontSize={30}>
              Control de cuentas
            </Typography>
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
              onClick={handleDownload}
            >
              Descargar
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}
