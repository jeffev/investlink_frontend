import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

import { formatBRL } from "../../utils/formatters";

export default function FavoriteTargetsCard({ favorite, price }) {
  const { ceiling_price, target_price } = favorite;
  return (
    <Card variant="outlined">
      <CardHeader
        title="Meus Alvos"
        titleTypographyProps={{ variant: "subtitle1", fontWeight: 700 }}
      />
      <CardContent>
        <Table size="small">
          <TableBody>
            {ceiling_price != null && (
              <TableRow>
                <TableCell sx={{ border: 0, pl: 0, color: "text.secondary" }}>
                  Preço Teto
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    border: 0,
                    pr: 0,
                    fontWeight: 600,
                    color: price <= ceiling_price ? "success.main" : "error.main",
                  }}
                >
                  {formatBRL(ceiling_price)}
                </TableCell>
              </TableRow>
            )}
            {target_price != null && (
              <TableRow>
                <TableCell sx={{ border: 0, pl: 0, color: "text.secondary" }}>
                  Preço Alvo
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    border: 0,
                    pr: 0,
                    fontWeight: 600,
                    color: price <= target_price ? "success.main" : "error.main",
                  }}
                >
                  {formatBRL(target_price)}
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell sx={{ border: 0, pl: 0, color: "text.secondary" }}>
                Cotação Atual
              </TableCell>
              <TableCell align="right" sx={{ border: 0, pr: 0, fontWeight: 700 }}>
                {formatBRL(price)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
