import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Checkbox, IconButton } from '@mui/material';

import ScoreMeter from './ScoreMeter';
import CycleBadge from './CycleBadge';
import ScoreDelta from './ScoreDelta';
import ScoreBreakdown from './ScoreBreakdown';
import { scoreBand } from '../utils/score';
import { formatBRL, formatNumber, formatPercent } from '../utils/formatters';

/**
 * O card da vitrine.
 *
 * O que mudou e por quê:
 *   A nota era um chip de 22px no canto — o dado mais importante da tela era o
 *   menos visível dela. Virou anel, com a faixa escrita embaixo, porque "69"
 *   não diz nada sem a régua.
 *
 *   Preço, P/VP e DY eram chips de contorno na mesma linha do setor e da
 *   procedência. Chip é rótulo, não número: dava a "R$ 5,21" o mesmo peso
 *   visual de "Shoppings", e a partir do quarto a linha quebrava e nenhum card
 *   ficava da mesma altura. Viraram faixa de valor sobre rótulo, alinhada
 *   entre todos os cards da grade.
 *
 *   O Fundamentus não publica nome de fundo e a coleta repete o ticker; sem
 *   nome de verdade, o subtítulo mostra o segmento em vez de repetir a sigla.
 */

function subtitle(opportunity) {
  const { companyname, ticker, segment, sectorname } = opportunity;
  const nome = companyname && companyname !== ticker ? companyname : null;
  const setor = segment || sectorname || null;
  return [nome, setor].filter(Boolean).join(' · ') || null;
}

function Metric({ label, value, hint }) {
  const conteudo = (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="subtitle1" fontWeight={700} noWrap lineHeight={1.3}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary" noWrap display="block">
        {label}
      </Typography>
    </Box>
  );
  return hint ? <Tooltip title={hint}>{conteudo}</Tooltip> : conteudo;
}

function metricsFor(opportunity, isFii) {
  if (isFii) {
    const temImovel = Number(opportunity.qtd_imoveis) > 0;
    return [
      { label: 'Cota', value: formatBRL(opportunity.price) },
      {
        label: 'P/VP',
        value: formatNumber(opportunity.p_vp),
        hint: 'Preço da cota sobre o valor patrimonial. Abaixo de 1 é desconto.',
      },
      {
        label: 'Dividend Yield',
        value: formatPercent(opportunity.dy),
        hint: 'Rendimento distribuído nos últimos 12 meses sobre a cota.',
      },
      temImovel && opportunity.vacancia_media != null
        ? {
            label: 'Vacância',
            value: formatPercent(opportunity.vacancia_media),
            hint: 'Parte do patrimônio que não está gerando aluguel.',
          }
        : null,
    ].filter(Boolean);
  }

  return [
    { label: 'Preço', value: formatBRL(opportunity.price) },
    {
      label: 'P/L',
      value: formatNumber(opportunity.p_l),
      hint: 'Preço sobre o lucro por ação dos últimos 12 meses.',
    },
    {
      label: 'Dividend Yield',
      value: formatPercent(opportunity.dy),
      hint: 'Proventos dos últimos 12 meses sobre o preço.',
    },
    opportunity.roe != null
      ? {
          label: 'ROE',
          value: formatPercent(opportunity.roe),
          hint: 'Quanto a empresa gera de lucro sobre o próprio patrimônio.',
        }
      : null,
  ].filter(Boolean);
}

function SourceNote({ source, date }) {
  if (!source) return null;
  const auditado = source === 'CVM';
  return (
    <Tooltip
      title={
        auditado
          ? `Demonstração auditada da CVM, 12 meses até ${date || '—'}`
          : 'Fonte pública, último exercício fechado — não auditado nesta base'
      }
    >
      <Chip
        label={auditado ? 'CVM · 12m' : 'Fonte pública'}
        size="small"
        variant="outlined"
        color={auditado ? 'success' : 'default'}
        sx={{ fontWeight: 500 }}
      />
    </Tooltip>
  );
}

function BulletList({ items, icon, color, emptyText }) {
  if (!items || items.length === 0) {
    return (
      <Typography variant="body2" color="text.disabled">
        {emptyText}
      </Typography>
    );
  }
  return (
    <Stack spacing={0.75}>
      {items.map((item) => (
        <Box
          key={item.code || item.message}
          sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}
        >
          <Box sx={{ color, display: 'flex', mt: '3px' }}>{icon}</Box>
          <Typography variant="body2" color="text.secondary">
            {item.message}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

function OpportunityCard({
  opportunity,
  assetType = 'ACAO',
  selected = false,
  onToggleCompare,
}) {
  const { score } = opportunity;
  const [anchorEl, setAnchorEl] = useState(null);
  const isFii = assetType === 'FII';
  const detailPath = `${isFii ? '/fii' : '/acao'}/${opportunity.ticker}`;
  const peerLabel = isFii ? 'segmento' : 'setor';
  const band = scoreBand(score?.score_total);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 2.5, pb: 1.5, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography
              component={Link}
              to={detailPath}
              variant="h6"
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              {opportunity.ticker}
            </Typography>
            {subtitle(opportunity) && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {subtitle(opportunity)}
              </Typography>
            )}
          </Box>

          <Box
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{ textAlign: 'center', cursor: 'pointer' }}
            role="button"
            aria-label="Ver composição do score"
          >
            <ScoreMeter score={score?.score_total} />
            <ScoreDelta
              delta={opportunity.score_delta}
              isNew={opportunity.score_is_new}
              since={opportunity.score_delta_since}
            />
            {band && (
              <Typography
                variant="caption"
                color={`${band.color}.main`}
                fontWeight={600}
                display="block"
                sx={{ mt: 0.5 }}
              >
                {band.short}
              </Typography>
            )}
          </Box>
        </Box>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { p: 2 } } }}
        >
          <ScoreBreakdown score={score?.score_total} pillars={score?.pillars || []} />
        </Popover>

        {opportunity.cycle_state && (
          <Box sx={{ mt: 1.5 }}>
            <CycleBadge
              state={opportunity.cycle_state}
              drawdown={opportunity.queda_12m}
              message={opportunity.cycle_message}
            />
          </Box>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(72px, 1fr))',
            gap: 1.5,
            mt: 2,
          }}
        >
          {metricsFor(opportunity, isFii).map((metric) => (
            <Metric key={metric.label} {...metric} />
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="overline" color="text.secondary" display="block">
          Por que está aqui
        </Typography>
        <Box sx={{ mt: 0.75 }}>
          <BulletList
            items={score?.reasons}
            color="success.main"
            icon={<CheckCircleOutlineIcon sx={{ fontSize: 16 }} />}
            emptyText={`Sem destaque relevante frente ao ${peerLabel}.`}
          />
        </Box>

        <Typography
          variant="overline"
          color="text.secondary"
          display="block"
          sx={{ mt: 2 }}
        >
          O que pode dar errado
        </Typography>
        <Box sx={{ mt: 0.75 }}>
          <BulletList
            items={score?.red_flags}
            color="warning.main"
            icon={<ReportProblemOutlinedIcon sx={{ fontSize: 16 }} />}
            emptyText="Nenhum alerta encontrado nos indicadores disponíveis."
          />
        </Box>
      </CardContent>

      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {onToggleCompare && (
          <Tooltip title={selected ? 'Remover da comparação' : 'Comparar este ativo'}>
            {/* O comparador existia e ficava desconectado da vitrine: era
                preciso copiar o ticker na mão para usá-lo. */}
            <IconButton
              size="small"
              color={selected ? 'primary' : 'default'}
              onClick={() => onToggleCompare(opportunity.ticker)}
              aria-label={`Comparar ${opportunity.ticker}`}
            >
              {selected ? (
                <Checkbox checked sx={{ p: 0 }} size="small" />
              ) : (
                <CompareArrowsIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        )}
        <SourceNote
          source={opportunity.fundamentals_source}
          date={opportunity.fundamentals_date}
        />
        <Button
          component={Link}
          to={detailPath}
          size="small"
          endIcon={<ArrowForwardIcon />}
          sx={{ ml: 'auto' }}
        >
          Ver análise completa
        </Button>
      </Box>
    </Card>
  );
}

export default OpportunityCard;
