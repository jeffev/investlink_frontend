import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const EMPTY_FORM = { ticker: "", quantity: "", average_price: "" };

const AddPositionModal = ({ open, onClose, onAdd, loading }) => {
  const [form, setForm] = useState(EMPTY_FORM);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () =>
    onAdd({
      ticker: form.ticker.trim().toUpperCase(),
      quantity: Number(form.quantity),
      average_price: Number(form.average_price),
    });

  const handleClose = () => {
    setForm(EMPTY_FORM);
    onClose();
  };

  const isValid =
    form.ticker.trim() !== "" &&
    Number(form.quantity) > 0 &&
    Number(form.average_price) > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Adicionar ação</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <TextField
          label="Ticker"
          name="ticker"
          value={form.ticker}
          onChange={handleChange}
          autoFocus
          inputProps={{ style: { textTransform: "uppercase" } }}
        />
        <TextField
          label="Quantidade"
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          inputProps={{ min: 1 }}
        />
        <TextField
          label="Preço médio (R$)"
          name="average_price"
          type="number"
          value={form.average_price}
          onChange={handleChange}
          inputProps={{ min: 0, step: "0.01" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!isValid || loading}>
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPositionModal;
