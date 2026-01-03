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

function Purchase() {
  const navigate = useNavigate();

  const [purchases, setPurchases] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    const res = await API.get("/purchases");
    setPurchases(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/purchases/add", {
      category,
      description,
      totalAmount: amount,
      date,
    });

    setCategory("");
    setDescription("");
    setAmount("");
    setDate("");
    fetchPurchases();
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

      {/* ADD PURCHASE FORM */}
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add Purchase
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
            type="submit"
            sx={{ mt: 2 }}
          >
            Add Purchase
          </Button>
        </form>
      </Paper>

      {/* PURCHASE HISTORY TABLE */}
      <Paper sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Purchase History
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Amount</b></TableCell>
              <TableCell><b>Date</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.description || "-"}</TableCell>
                <TableCell>₹ {p.totalAmount}</TableCell>
                <TableCell>
                  {new Date(p.date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

export default Purchase;
