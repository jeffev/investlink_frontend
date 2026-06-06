import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';

function SectionTitle({ children }) {
  return (
    <Typography variant="h6" fontWeight={700} sx={{ mt: 4, mb: 1 }}>
      {children}
    </Typography>
  );
}

function InfoCard({ icon, color, children }) {
  return (
    <Card variant="outlined" sx={{ borderColor: color, mb: 2 }}>
      <CardContent sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', pb: '12px !important' }}>
        <Box sx={{ color, mt: 0.25 }}>{icon}</Box>
        <Typography variant="body2">{children}</Typography>
      </CardContent>
    </Card>
  );
}

export default function GuiaDividendos() {
  return (
    <Box sx={{ py: 3, maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Dividendos — Renda Passiva com Acoes e FIIs
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Dividendos sao a parcela do lucro que a empresa distribui aos acionistas. Entender como funcionam os dividendos e essencial para estrategias de renda passiva.
      </Typography>

      <SectionTitle>O que sao dividendos e JCP</SectionTitle>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body2" paragraph>
        Quando uma empresa tem lucro, pode reinvesti-lo no negocio ou distribuir parte aos acionistas. Ha duas formas principais de distribuicao no Brasil:
      </Typography>
      <Table size="small" sx={{ mb: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, width: '25%' }}>Tipo</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Como funciona</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[
            ['Dividendos', 'Distribuicao direta de parte do lucro liquido. Isentos de IR para a pessoa fisica atualmente. Obrigatorio distribuir ao menos 25% do lucro ajustado (Lei 6.404/76).'],
            ['JCP (Juros sobre Capital Proprio)', 'Remuneracao do capital do acionista tratada como despesa financeira pela empresa, gerando beneficio fiscal. Para o acionista PF: desconto de 15% de IR na fonte. Economicamente equivalente ao dividendo, mas com tratamento tributario diferente.'],
          ].map(([tipo, desc]) => (
            <TableRow key={tipo} hover>
              <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{tipo}</TableCell>
              <TableCell><Typography variant="body2">{desc}</Typography></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Dividend Yield (DY) — como calcular e interpretar</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 2, mb: 2 }}>
            <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
              DY = (Dividendos por Acao nos ultimos 12 meses / Preco Atual) x 100
            </Typography>
          </Box>
          <Typography variant="body2" paragraph>
            Exemplo: se uma acao pagou R$ 3,00 em dividendos nos ultimos 12 meses e custa R$ 30,00, o DY e de 10%.
          </Typography>
          <Typography variant="body2" paragraph>
            O DY varia com o preco da acao: se o preco cai e os dividendos se mantem, o DY sobe automaticamente — nem sempre por bons motivos.
          </Typography>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            DY consistente ao longo dos anos e mais relevante do que um DY alto pontual. Verifique o historico de distribuicoes antes de assumir que o DY atual se repetira.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Payout — quanto do lucro e distribuido</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 2, mb: 2 }}>
            <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
              Payout = (Dividendos Totais / Lucro Liquido) x 100
            </Typography>
          </Box>
          <Typography variant="body2" paragraph>
            Um payout de 60% significa que a empresa distribui 60% do lucro e reinveste 40%. O nivel ideal de payout depende do momento da empresa:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Payout alto (70–100%):</strong> empresa madura com poucas oportunidades de reinvestimento. Bom para renda, mas pode limitar o crescimento futuro.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Payout baixo (20–40%):</strong> empresa em crescimento reinvestindo no negocio. Menor renda imediata, mas potencial de valorizacao maior.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Payout {'>'} 100%:</strong> empresa distribuindo mais do que lucrou — insustentavel no longo prazo, pode indicar uso de reservas ou endividamento para pagar dividendos.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Dividend Trap — a armadilha do DY alto</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Uma das armadilhas mais comuns para investidores iniciantes e o <strong>Dividend Trap</strong>: uma acao com DY muito alto nao necessariamente e uma boa escolha.
          </Typography>
          <Typography variant="body2" paragraph>
            O DY e calculado com base no preco atual. Se o preco da acao caiu muito (por problemas na empresa), o DY sobe artificialmente. Exemplo: acao pagou R$ 5,00 em dividendos, custava R$ 50,00 (DY = 10%), o preco caiu para R$ 25,00 (DY aparente = 20%) — mas a empresa pode estar em serias dificuldades.
          </Typography>
          <InfoCard icon={<WarningAmberOutlinedIcon />} color="warning.main">
            Desconfie de DY acima de 15–20% em acoes. Verifique se o lucro da empresa suporta a distribuicao, se o payout e sustentavel e se houve queda recente de preco que inflou o DY.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>FIIs vs Acoes: diferenca de tributacao</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small" sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: '30%' }}>Aspecto</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Acoes (Dividendos)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>FIIs (Rendimentos)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Tributacao IR PF', 'Atualmente isentos (lei complementar)', 'Isentos para PF (condicoes: fundo com 50+ cotistas, nao concentrado, negociado em bolsa)'],
                ['Frequencia', 'Trimestral, semestral ou anual (varia)', 'Mensal (obrigatorio distribuir 95% do resultado)'],
                ['Ganho de capital na venda', '15% sobre lucro (acima de R$ 20k/mes)', '20% sobre lucro (sem isenção mensal)'],
                ['JCP', 'Desconto de 15% IR na fonte', 'Nao aplicavel a FIIs'],
              ].map(([asp, ac, fii]) => (
                <TableRow key={asp} hover>
                  <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{asp}</TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{ac}</Typography></TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{fii}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
            A legislacao tributaria sobre dividendos de acoes pode mudar. Consulte um contador ou a Receita Federal para as regras vigentes no momento do investimento.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Estrategia de dividendos e renda passiva</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            A estrategia de investimento em dividendos busca construir uma carteira que gere renda passiva crescente ao longo do tempo. Os princípios basicos:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Consistencia sobre magnitude:</strong> prefira empresas que pagam dividendos regularmente ha muitos anos, mesmo que o DY nao seja o maior do mercado.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Crescimento de dividendos:</strong> empresas que aumentam os dividendos ao longo do tempo (dividend growth investing) combinam renda presente com crescimento futuro.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Reinvestimento (DRIP):</strong> reinvestir os dividendos recebidos na compra de mais acoes amplifica o efeito dos juros compostos significativamente no longo prazo.
            </Typography>
          </Box>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            Use a aba Minha Carteira para acompanhar a renda mensal estimada de FIIs e o historico de dividendos de acoes. A combinacao de acoes pagadoras de dividendos com FIIs e uma estrategia comum no Brasil.
          </InfoCard>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
