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

const PILARES = [
  {
    pilar: 'Valuation',
    peso: 'Valor (30%)',
    desc: 'Avalia se o preco de mercado e justo em relacao aos fundamentos. Metricas: P/L, P/VP, EV/EBIT, desconto em relacao a formula de Graham.',
  },
  {
    pilar: 'Qualidade',
    peso: 'Qualidade (35%)',
    desc: 'Mede a eficiencia da empresa em gerar retorno. Metricas: ROE, ROIC, ROA, margens operacional e liquida.',
  },
  {
    pilar: 'Crescimento',
    peso: 'Crescimento (20%)',
    desc: 'Avalia a capacidade de expansao da empresa. Metricas: CAGR de receitas em 5 anos, crescimento de lucro.',
  },
  {
    pilar: 'Dividendos',
    peso: 'Dividendos (15%)',
    desc: 'Mede o retorno direto ao acionista via proventos. Metrica: Dividend Yield dos ultimos 12 meses.',
  },
];

export default function GuiaAnaliseFundamentalista() {
  return (
    <Box sx={{ py: 3, maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Analise Fundamentalista
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        A analise fundamentalista avalia o valor intrinseco de uma empresa com base em seus dados financeiros. E a metodologia utilizada pelo InvestLink para calcular o Score e treinar o modelo de IA.
      </Typography>

      <SectionTitle>O que e analise fundamentalista</SectionTitle>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body2" paragraph>
        A analise fundamentalista parte do principio de que o <strong>preco de uma acao pode divergir do seu valor real</strong> no curto prazo, mas tende a convergir no longo prazo. O objetivo e identificar empresas cujo valor intrinseco e maior que o preco atual de mercado.
      </Typography>
      <Typography variant="body2" paragraph>
        Para estimar esse valor, o analista fundamentalista examina os demonstrativos financeiros da empresa (balanco, DRE, fluxo de caixa), indicadores de rentabilidade, nivel de endividamento, posicao competitiva e perspectivas de crescimento.
      </Typography>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Analise Tecnica vs Analise Fundamentalista</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Sao duas abordagens distintas e complementares:
          </Typography>
          <Table size="small" sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: '30%' }}>Dimensao</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Analise Tecnica</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Analise Fundamentalista</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Foco', 'Graficos de preco e volume', 'Dados financeiros da empresa'],
                ['Horizonte', 'Curto e medio prazo', 'Medio e longo prazo'],
                ['Base', 'Padroes historicos de preco', 'Valor do negocio'],
                ['Pergunta', '"Para onde o preco vai agora?"', '"Quanto vale essa empresa?"'],
              ].map(([dim, at, af]) => (
                <TableRow key={dim} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{dim}</TableCell>
                  <TableCell><Typography variant="body2">{at}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{af}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
            O InvestLink foca na analise fundamentalista. A analise tecnica pode complementar a decisao de timing de entrada, mas nao e o objetivo da plataforma.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Os 4 pilares do Score InvestLink</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            O Score do InvestLink combina quatro pilares da analise fundamentalista:
          </Typography>
          <Table size="small" sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: '22%' }}>Pilar</TableCell>
                <TableCell sx={{ fontWeight: 700, width: '20%' }}>Peso no Score</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>O que mede</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {PILARES.map((row) => (
                <TableRow key={row.pilar} hover>
                  <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{row.pilar}</TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{row.peso}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{row.desc}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography variant="body2" paragraph>
            Cada indicador dentro de um pilar e normalizado com <strong>z-scores setoriais</strong> — ou seja, a empresa e comparada com outras do mesmo setor, nao com o mercado todo. Isso evita distorcoes entre setores com multiplos naturalmente diferentes (ex: bancos vs varejo).
          </Typography>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            Um Score alto indica bons fundamentos relativos ao setor da empresa. Nao indica necessariamente que a acao esta barata — uma empresa excelente pode estar sendo negociada a multiplos elevados.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Limitacoes da analise fundamentalista</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box component="ul" sx={{ pl: 2, mt: 0 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
              <strong>Dados atrasados:</strong> os demonstrativos financeiros sao publicados trimestral ou anualmente. A situacao atual da empresa pode ser diferente dos dados disponiveis.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
              <strong>Subjetividade na qualidade:</strong> aspectos como qualidade da gestao, vantagem competitiva (moat) e cultura organizacional sao dificeis de quantificar.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
              <strong>Sem previsao de preco:</strong> a analise fundamentalista identifica empresas subavaliadas, mas nao quando o mercado vai reconhecer esse valor.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
              <strong>Eventos imprevistos:</strong> crises macroeconomicas, mudancas regulatorias ou disrupcoes tecnologicas podem invalidar qualquer analise fundamentalista.
            </Typography>
          </Box>
          <InfoCard icon={<WarningAmberOutlinedIcon />} color="warning.main">
            A analise fundamentalista e uma ferramenta poderosa, mas nao e infalivel. Use-a como parte de um processo de decisao mais amplo, sempre considerando seu perfil de risco e horizonte de investimento.
          </InfoCard>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
