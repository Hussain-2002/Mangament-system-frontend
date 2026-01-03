import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";

function Sale() {
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    const res = await API.get("/sales");
    setSales(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/sales/add", {
      category,
      description,
      totalAmount: amount,
      date,
    });

    setCategory("");
    setDescription("");
    setAmount("");
    setDate("");

    fetchSales();
  };

  // ✅ SECURE RECEIPT DOWNLOAD (JWT + BLOB)
  const downloadReceipt = async (saleId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/sales/receipt/${saleId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download receipt");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `sale-receipt-${saleId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Receipt download error:", error);
      alert("Failed to download receipt");
    }
  };

  return (
    <Container>
      {/* BACK BUTTON */}
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        sx={{ mt: 2, mb: 2 }}
        onClick={() => navigate("/dashboard")}
      >
        Back
      </Button>

      {/* ADD SALE FORM */}
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add Sale
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="Category"
            fullWidth
            margin="normal"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <MenuItem value="Grocery">Grocery</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>

          {category === "Other" && (
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          )}

          <TextField
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <TextField
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />

          <Button
            variant="contained"
            color="secondary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Add Sale
          </Button>
        </form>
      </Paper>

      {/* SALES HISTORY TABLE */}
      <Paper sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Sales History
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Amount</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Receipt</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.category}</TableCell>
                <TableCell>{s.description || "-"}</TableCell>
                <TableCell>₹ {s.totalAmount}</TableCell>
                <TableCell>
                  {new Date(s.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => downloadReceipt(s._id)}
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

export default Sale;
