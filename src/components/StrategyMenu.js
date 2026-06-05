import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import StrategyService from "../services/strategy.service";

function StrategyMenu({ assetType, columnFilters, sorting, onApplyStrategy, onBacktest }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [strategies, setStrategies] = useState([]);
  const [loadingStrategies, setLoadingStrategies] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [strategyName, setStrategyName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const menuOpen = Boolean(anchorEl);
  const hasActiveFilters = columnFilters && columnFilters.length > 0;

  const loadStrategies = () => {
    setLoadingStrategies(true);
    StrategyService.getStrategies(assetType)
      .then((data) => setStrategies(Array.isArray(data) ? data : []))
      .catch(() => setStrategies([]))
      .finally(() => setLoadingStrategies(false));
  };

  useEffect(() => {
    loadStrategies();
  }, [assetType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleApply = (strategy) => {
    const filters = JSON.parse(strategy.filters || "[]");
    const sort = strategy.sorting ? JSON.parse(strategy.sorting) : [];
    onApplyStrategy(filters, sort);
    handleCloseMenu();
  };

  const handleDelete = async (event, strategyId) => {
    event.stopPropagation();
    setDeleting(strategyId);
    try {
      await StrategyService.deleteStrategy(strategyId);
      setStrategies((prev) => prev.filter((s) => s.id !== strategyId));
    } catch {
      // silently ignore delete errors in menu context
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = async () => {
    if (!strategyName.trim()) return;
    setSaving(true);
    try {
      await StrategyService.createStrategy({
        name: strategyName.trim(),
        asset_type: assetType,
        filters: JSON.stringify(columnFilters),
        sorting: sorting && sorting.length > 0 ? JSON.stringify(sorting) : null,
      });
      setSaveDialogOpen(false);
      setStrategyName("");
      loadStrategies();
    } catch {
      // silently ignore save errors — user can retry
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Tooltip title="Estratégias salvas">
        <Button
          onClick={handleOpenMenu}
          startIcon={<BookmarkBorderIcon />}
          variant="outlined"
          size="small"
        >
          Estratégias
        </Button>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        PaperProps={{ sx: { minWidth: 240, maxWidth: 320 } }}
      >
        <Box sx={{ px: 2, pt: 1, pb: 0.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            MINHAS ESTRATÉGIAS
          </Typography>
        </Box>

        {loadingStrategies && (
          <MenuItem disabled>
            <CircularProgress size={16} sx={{ mr: 1 }} />
            <Typography variant="body2">Carregando...</Typography>
          </MenuItem>
        )}

        {!loadingStrategies && strategies.length === 0 && (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              Nenhuma estratégia salva.
            </Typography>
          </MenuItem>
        )}

        {!loadingStrategies &&
          strategies.map((strategy) => (
            <MenuItem
              key={strategy.id}
              onClick={() => handleApply(strategy)}
              sx={{ justifyContent: "space-between", pr: 0.5 }}
            >
              <ListItemText
                primary={strategy.name}
                primaryTypographyProps={{ variant: "body2", noWrap: true }}
              />
              <IconButton
                size="small"
                onClick={(e) => handleDelete(e, strategy.id)}
                disabled={deleting === strategy.id}
                sx={{ ml: 1, flexShrink: 0 }}
              >
                {deleting === strategy.id ? (
                  <CircularProgress size={14} />
                ) : (
                  <DeleteIcon fontSize="small" color="error" />
                )}
              </IconButton>
            </MenuItem>
          ))}

        <Divider sx={{ my: 0.5 }} />

        {onBacktest &&
          !loadingStrategies &&
          strategies.map((strategy) =>
            strategy.asset_type === "STOCK" ? (
              <MenuItem
                key={`bt-${strategy.id}`}
                onClick={() => {
                  handleCloseMenu();
                  onBacktest(strategy);
                }}
                sx={{ color: "primary.main" }}
              >
                <QueryStatsIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">Backtest: {strategy.name}</Typography>
              </MenuItem>
            ) : null
          )}

        {onBacktest && !loadingStrategies && strategies.some((s) => s.asset_type === "STOCK") && (
          <Divider sx={{ my: 0.5 }} />
        )}

        <MenuItem
          onClick={() => {
            handleCloseMenu();
            setSaveDialogOpen(true);
          }}
          disabled={!hasActiveFilters}
        >
          <BookmarkAddIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="body2">
            {hasActiveFilters ? "Salvar estratégia atual" : "Salvar (ative filtros primeiro)"}
          </Typography>
        </MenuItem>
      </Menu>

      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Salvar estratégia</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Nome da estratégia"
            value={strategyName}
            onChange={(e) => setStrategyName(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
            inputProps={{ maxLength: 100 }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && strategyName.trim()) handleSave();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!strategyName.trim() || saving}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default StrategyMenu;
