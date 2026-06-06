import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { formatCurrency } from "../../utils/portfolioFormatters";

const LS_KEY = "portfolioTargetAllocation";

function loadTargetFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.targetStocks === "number") return parsed.targetStocks;
    }
  } catch {}
  return 60;
}

function AllocationBar({ label, currentPct, targetPct }) {
  const deviation = currentPct - targetPct;
  const isOver = deviation > 0;
  const color = Math.abs(deviation) <= 2 ? "success" : isOver ? "error" : "warning";

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body2" fontWeight={600}>{label}</Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">
            atual {currentPct.toFixed(1)}% / alvo {targetPct.toFixed(0)}%
          </Typography>
          <Chip
            label={`${deviation >= 0 ? "+" : ""}${deviation.toFixed(1)}%`}
            color={color}
            size="small"
          />
        </Box>
      </Box>
      <Box sx={{ position: "relative", height: 10, borderRadius: 1, bgcolor: "action.hover" }}>
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            borderRadius: 1,
            width: `${Math.min(currentPct, 100)}%`,
            bgcolor: `${color}.main`,
            transition: "width 0.3s ease",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: -3,
            left: `${Math.min(targetPct, 100)}%`,
            height: 16,
            width: 2,
            bgcolor: "text.primary",
            borderRadius: 1,
          }}
        />
      </Box>
      <LinearProgress sx={{ display: "none" }} />
    </Box>
  );
}

function RebalanceTab({ positions, fiiPositions }) {
  const [targetStocks, setTargetStocks] = useState(loadTargetFromStorage);

  const targetFiis = 100 - targetStocks;

  const totalStocksValue = positions.reduce((s, p) => s + (p.current_value || 0), 0);
  const totalFiisValue = fiiPositions.reduce((s, p) => s + (p.current_value || 0), 0);
  const totalValue = totalStocksValue + totalFiisValue;

  const currentStocksPct = totalValue > 0 ? (totalStocksValue / totalValue) * 100 : 0;
  const currentFiisPct = totalValue > 0 ? (totalFiisValue / totalValue) * 100 : 0;

  const deviationStocks = currentStocksPct - targetStocks;
  const amountToRebalance = Math.abs((deviationStocks / 100) * totalValue);

  const handleSliderChange = (_, value) => {
    setTargetStocks(value);
    localStorage.setItem(LS_KEY, JSON.stringify({ targetStocks: value }));
  };

  const sectors = Object.entries(
    positions.reduce((acc, p) => {
      const sector = p.sectorname || "Outros";
      acc[sector] = (acc[sector] || 0) + (p.current_value || 0);
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({
      name,
      value,
      pct: totalStocksValue > 0 ? (value / totalStocksValue) * 100 : 0,
    }));

  if (totalValue === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          Adicione posições em ações ou FIIs para ver o rebalanceamento.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Alocação: Ações vs FIIs
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Typography variant="body2" sx={{ minWidth: 60 }}>Ações {targetStocks}%</Typography>
            <Slider
              value={targetStocks}
              onChange={handleSliderChange}
              min={0}
              max={100}
              step={5}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `Ações ${v}% / FIIs ${100 - v}%`}
              sx={{ flex: 1 }}
            />
            <Typography variant="body2" sx={{ minWidth: 60, textAlign: "right" }}>
              FIIs {targetFiis}%
            </Typography>
          </Box>

          <AllocationBar label="Ações" currentPct={currentStocksPct} targetPct={targetStocks} />
          <AllocationBar label="FIIs" currentPct={currentFiisPct} targetPct={targetFiis} />

          {Math.abs(deviationStocks) > 2 && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 1,
                bgcolor: "action.hover",
                borderLeft: 4,
                borderColor: deviationStocks > 0 ? "error.main" : "warning.main",
              }}
            >
              <Typography variant="body2">
                {deviationStocks > 0 ? (
                  <>
                    <strong>Ações</strong> está {deviationStocks.toFixed(1)}% acima do alvo
                    ({formatCurrency(amountToRebalance)} a mais).{" "}
                    <strong>Sugestão:</strong> aporte {formatCurrency(amountToRebalance)} em FIIs.
                  </>
                ) : (
                  <>
                    <strong>FIIs</strong> está {Math.abs(deviationStocks).toFixed(1)}% acima do alvo
                    ({formatCurrency(amountToRebalance)} a mais).{" "}
                    <strong>Sugestão:</strong> aporte {formatCurrency(amountToRebalance)} em Ações.
                  </>
                )}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {sectors.length > 0 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Concentração por Setor (Ações)
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Setor</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell align="right">% das Ações</TableCell>
                  <TableCell sx={{ width: "35%" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sectors.map(({ name, value, pct }) => (
                  <TableRow key={name}>
                    <TableCell>{name}</TableCell>
                    <TableCell align="right">{formatCurrency(value)}</TableCell>
                    <TableCell align="right">{pct.toFixed(1)}%</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            flex: 1,
                            height: 8,
                            borderRadius: 1,
                            bgcolor: "action.hover",
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              height: "100%",
                              borderRadius: 1,
                              width: `${pct}%`,
                              bgcolor:
                                pct > 40 ? "error.main" : pct > 25 ? "warning.main" : "primary.main",
                              transition: "width 0.3s ease",
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default RebalanceTab;
