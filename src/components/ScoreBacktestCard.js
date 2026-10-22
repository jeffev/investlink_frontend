import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { formatPercent } from "../utils/formatters";

/**
 * Como o decil de topo do score se saiu em cada ano.
 *
 * As ressalvas ficam ACIMA dos números, não abaixo. Um backtest lido sem as
 * suas limitações vira promessa de retorno, e é justamente isso que este
 * projeto não pode passar a fazer.
 */

function ReturnCell({ value, compareWith }) {
  const beats = compareWith != null && value > compareWith;
  return (
    <TableCell align="right" sx={{ fontWeight: beats ? 700 : 500 }}>
      {formatPercent(value)}
    </TableCell>
  );
}

function Summary({ summary }) {
  if (!summary) return null;
  const beats = summary.top_decile_annualised > summary.universe_annualised;

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
      <Chip
        label={`Decil de topo: ${formatPercent(summary.top_decile_annualised)} a.a.`}
        color={beats ? "success" : "default"}
      />
      <Chip
        label={`Média do universo: ${formatPercent(summary.universe_annualised)} a.a.`}
        variant="outlined"
      />
      <Chip
        label={`Bateu em ${summary.beat_universe_in} de ${summary.years} anos`}
        variant="outlined"
      />
    </Stack>
  );
}

function Caveats({ caveats }) {
  if (!caveats || caveats.length === 0) return null;
  return (
    <Alert severity="warning" sx={{ mb: 2 }}>
      <AlertTitle>Leia antes de olhar os números</AlertTitle>
      <Stack component="ul" sx={{ pl: 2, m: 0 }} spacing={0.5}>
        {caveats.map((caveat) => (
          <Typography component="li" variant="body2" key={caveat.code}>
            {caveat.message}
          </Typography>
        ))}
      </Stack>
    </Alert>
  );
}

function YearTable({ years }) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Período</TableCell>
          <TableCell align="right">Decil de topo</TableCell>
          <TableCell align="right">Média do universo</TableCell>
          <TableCell align="right">Diferença</TableCell>
          <TableCell align="right">Universo</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {years.map((year) => (
          <TableRow key={year.year}>
            <TableCell>{year.holding_period}</TableCell>
            <ReturnCell
              value={year.top_decile_return}
              compareWith={year.universe_return}
            />
            <TableCell align="right">{formatPercent(year.universe_return)}</TableCell>
            <TableCell
              align="right"
              sx={{
                color: year.excess_return >= 0 ? "success.main" : "error.main",
                fontWeight: 600,
              }}
            >
              {formatPercent(year.excess_return)}
            </TableCell>
            <TableCell align="right" sx={{ color: "text.secondary" }}>
              {year.universe_size}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function ScoreBacktestCard({ backtest, loading, error }) {
  const [expanded, setExpanded] = useState(false);

  const years = backtest?.years || [];
  const hasResult = years.length > 0;

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, value) => setExpanded(value)}
      sx={{ mt: 3 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1" fontWeight={700}>
          Como este score se saiu no passado
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={28} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : !hasResult ? (
          <Alert severity="info">
            Sem histórico suficiente para medir. A série de múltiplos anuais precisa
            ter sido derivada das demonstrações da CVM.
          </Alert>
        ) : (
          <Card variant="outlined">
            <CardHeader
              title="Decil de topo contra a média do universo"
              subheader={
                "Cada ano é pontuado com os múltiplos daquele ano — o score de 2021 " +
                "não sabe nada de 2022."
              }
              titleTypographyProps={{ variant: "subtitle2", fontWeight: 700 }}
              subheaderTypographyProps={{ variant: "caption" }}
            />
            <CardContent>
              <Caveats caveats={backtest.caveats} />
              <Summary summary={backtest.summary} />
              <YearTable years={years} />
            </CardContent>
          </Card>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
