import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SellIcon from "@mui/icons-material/Sell";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [summary, setSummary] = useState({
    totalPurchase: 0,
    totalSales: 0,
    profit: 0,
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    const res = await API.get("/dashboard/summary");
    setSummary(res.data);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>
        Dashboard
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Welcome, <b>{username}</b> 👋
      </Typography>

      {/* SUMMARY CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <ShoppingCartIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography>Total Purchase</Typography>
            <Typography variant="h6">
              ₹ {summary.totalPurchase}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <SellIcon color="secondary" sx={{ fontSize: 40 }} />
            <Typography>Total Sales</Typography>
            <Typography variant="h6">
              ₹ {summary.totalSales}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              textAlign: "center",
              backgroundColor:
                summary.profit >= 0 ? "#e8f5e9" : "#ffebee",
            }}
          >
            <TrendingUpIcon sx={{ fontSize: 40 }} />
            <Typography>Profit / Loss</Typography>
            <Typography
              variant="h6"
              color={summary.profit >= 0 ? "green" : "red"}
            >
              ₹ {summary.profit}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* NAVIGATION */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/purchases")}
          >
            Go to Purchases
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => navigate("/sales")}
          >
            Go to Sales
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
