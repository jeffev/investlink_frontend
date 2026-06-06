import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
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
import { alpha } from '@mui/material/styles';

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

const COLUNAS_PRINCIPAIS = [
  { col: 'Ticker', desc: 'Código de negociação da ação na B3 (ex: PETR4, VALE3). Clique no ticker para abrir o detalhe completo da ação.' },
  { col: 'Nome', desc: 'Razão social da empresa.' },
  { col: 'Setor', desc: 'Setor econômico da empresa. Use o filtro de setor para comparar empresas similares.' },
  { col: 'Preço', desc: 'Cotação mais recente coletada pelo pipeline de dados.' },
  { col: 'P/L', desc: 'Preço dividido pelo Lucro por Ação. Valores menores tendem a indicar ação mais barata em relação ao lucro gerado.' },
  { col: 'P/VP', desc: 'Preço dividido pelo Valor Patrimonial por Ação. Abaixo de 1 pode indicar subavaliação contábil.' },
  { col: 'DY', desc: 'Dividend Yield — dividendos pagos nos últimos 12 meses em relação ao preço atual.' },
  { col: 'ROE', desc: 'Retorno sobre o Patrimônio Líquido. Mede a eficiência da empresa em gerar lucro com recursos próprios.' },
  { col: 'Análise ML', desc: 'Classificação do modelo de inteligência artificial: BARATA, NEUTRA ou CARA. Ver seção dedicada abaixo.' },
  { col: 'Score', desc: 'Pontuação composta (0–100) que combina qualidade, valuation, crescimento e dividendos.' },
];

export default function GuiaListaAcoes() {
  return (
    <Box sx={{ py: 3, maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Como usar a Lista de Ações
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        A Lista de Ações exibe os principais indicadores fundamentalistas das ações do IBXX, permite filtrar, buscar e favoritar ativos, e conta com análise por inteligência artificial.
      </Typography>

      <SectionTitle>Visão geral das colunas</SectionTitle>
      <Divider sx={{ mb: 2 }} />
      <Table size="small" sx={{ mb: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, width: '22%' }}>Coluna</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>O que representa</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {COLUNAS_PRINCIPAIS.map((row) => (
            <TableRow key={row.col} hover>
              <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{row.col}</TableCell>
              <TableCell><Typography variant="body2">{row.desc}</Typography></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Como usar filtros e busca</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            A barra de busca no topo da tabela filtra por ticker ou nome da empresa em tempo real. Basta digitar as primeiras letras para ver os resultados filtrados.
          </Typography>
          <Typography variant="body2" paragraph>
            O filtro de <strong>Setor</strong> permite selecionar um ou mais setores para comparar empresas do mesmo segmento. Isso é útil para identificar quais empresas de Petróleo, Bancos ou Varejo estão com melhores fundamentos relativos.
          </Typography>
          <Typography variant="body2" paragraph>
            Cada coluna da tabela pode ser ordenada clicando no cabeçalho. A ordenação por <strong>Score</strong> ou por <strong>Análise ML</strong> é especialmente útil para encontrar rapidamente as ações com melhores fundamentos segundo o modelo.
          </Typography>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            Use "Ordenar por Score decrescente" para ver as ações com melhores fundamentos compostos no topo. Combine com o filtro de setor para fazer comparações setoriais.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>O chip ML (BARATA / NEUTRA / CARA) e o Score</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            A coluna <strong>Análise ML</strong> exibe um chip colorido com a classificação do modelo de machine learning treinado com dados históricos do Ibovespa:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip
                label="BARATA"
                size="small"
                sx={(theme) => {
                  const b = theme.palette.success.main;
                  return { backgroundColor: alpha(b, 0.12), color: b, border: `1px solid ${alpha(b, 0.35)}`, fontWeight: 600 };
                }}
              />
              <Typography variant="body2">Modelo identificou padrão de fundamentos associado a retorno acima do Ibovespa em +15% ou mais.</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip
                label="NEUTRA"
                size="small"
                sx={(theme) => {
                  const b = theme.palette.primary.main;
                  return { backgroundColor: alpha(b, 0.12), color: b, border: `1px solid ${alpha(b, 0.35)}`, fontWeight: 600 };
                }}
              />
              <Typography variant="body2">Retorno esperado próximo ao do Ibovespa (entre -15% e +15%).</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip
                label="CARA"
                size="small"
                sx={(theme) => {
                  const b = theme.palette.error.main;
                  return { backgroundColor: alpha(b, 0.12), color: b, border: `1px solid ${alpha(b, 0.35)}`, fontWeight: 600 };
                }}
              />
              <Typography variant="body2">Modelo identificou padrão associado a retorno abaixo do Ibovespa em -15% ou mais.</Typography>
            </Box>
          </Box>
          <Typography variant="body2" paragraph>
            Passe o mouse sobre o chip para ver as <strong>probabilidades individuais</strong> de cada classe. Probabilidades próximas de 33% nas três classes indicam que o modelo tem baixa confiança — trate essas classificações com cautela.
          </Typography>
          <Typography variant="body2" paragraph>
            O <strong>Score</strong> (0–100) é calculado separadamente do modelo ML. Ele combina quatro dimensões: Qualidade (35%), Valor (30%), Crescimento (20%) e Dividendos (15%). Um Score alto indica bons fundamentos relativos ao setor, mas não necessariamente que a ação está barata.
          </Typography>
          <InfoCard icon={<WarningAmberOutlinedIcon />} color="warning.main">
            A análise por IA é baseada em padrões históricos e não constitui recomendação de investimento. Use o chip ML como ponto de partida, nunca como decisão final.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Como favoritar uma ação</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Cada linha da tabela possui um ícone de estrela na coluna de ações. Clique na estrela para adicionar a ação às suas Favoritas. O ícone ficará preenchido quando a ação estiver favoritada.
          </Typography>
          <Typography variant="body2" paragraph>
            As ações favoritadas aparecem na página <strong>Favoritas</strong> (menu lateral), onde você pode configurar alertas de preço e personalizar as colunas exibidas.
          </Typography>
          <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
            Favoritas ficam salvas na sua conta. Ao fazer login em outro dispositivo, sua lista de favoritas estará disponível.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Como acessar o detalhe de uma ação</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Clique no <strong>ticker</strong> (código da ação, ex: PETR4) na primeira coluna da tabela para abrir a página de detalhe. Lá você encontrará:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Todos os indicadores fundamentalistas da empresa</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Gráfico de candlestick com histórico de preços (1M, 3M, 6M, 1A, Tudo)</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Card de Preço Teto calculado pelas fórmulas de Bazin e Gordon</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Classificação ML com probabilidades detalhadas</Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Como usar o Comparador a partir da lista</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Na barra de ferramentas da tabela existe o botão <strong>Comparar Ativos</strong> que abre a página de Comparador. Você também pode acessar o Comparador diretamente pelo menu lateral.
          </Typography>
          <Typography variant="body2" paragraph>
            No Comparador, selecione dois ou mais tickers para ver uma tabela com 14 indicadores lado a lado, com o melhor valor destacado em verde, e um gráfico de preço normalizado (base 100) para comparar a performance histórica relativa.
          </Typography>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            Use o Comparador quando quiser decidir entre duas empresas do mesmo setor. Por exemplo: PETR3 vs PETR4, ou ITUB4 vs BBAS3.
          </InfoCard>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
