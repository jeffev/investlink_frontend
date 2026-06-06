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

const COLUNAS_FII = [
  { col: 'Ticker', desc: 'Código de negociação do FII na B3 (ex: KNRI11, HGLG11). Clique para abrir o detalhe.' },
  { col: 'Nome', desc: 'Nome do fundo imobiliário.' },
  { col: 'Segmento', desc: 'Tipo de imóvel ou estratégia do fundo: Lajes Corporativas, Logística, Shoppings, Residencial, Agro, Papel, FOF, entre outros.' },
  { col: 'Preço', desc: 'Cotação mais recente da cota do FII.' },
  { col: 'DY Mensal', desc: 'Dividend Yield mensal — último rendimento distribuído dividido pelo preço atual. FIIs distribuem rendimentos mensalmente.' },
  { col: 'DY 12M', desc: 'Soma dos rendimentos dos últimos 12 meses dividida pelo preço atual. Melhor para comparação de longo prazo.' },
  { col: 'P/VP', desc: 'Preço da cota dividido pelo Valor Patrimonial por Cota. Abaixo de 1 indica que o mercado precifica a cota abaixo do valor dos ativos do fundo.' },
  { col: 'Vacancia', desc: 'Percentual de área disponível para locação que está desocupada. Vacância alta reduz a receita de aluguel e pode pressionar os rendimentos.' },
  { col: 'Gestao', desc: 'Tipo de gestão: Ativa (gestor toma decisões de compra/venda) ou Passiva.' },
];

const SEGMENTOS = [
  { seg: 'Lajes Corporativas', desc: 'Escritórios e prédios comerciais em grandes centros urbanos. Sensíveis ao ciclo econômico e ao trabalho remoto.' },
  { seg: 'Logística', desc: 'Galpões e centros de distribuição. Beneficiados pelo crescimento do e-commerce.' },
  { seg: 'Shoppings', desc: 'Participações em shoppings centers. Receita atrelada ao fluxo de visitantes e ao consumo.' },
  { seg: 'Residencial', desc: 'Imóveis residenciais para aluguel. Segmento em crescimento no Brasil.' },
  { seg: 'Agro', desc: 'Terras agrícolas com contratos de arrendamento. Rendimentos em reais indexados ao valor da terra.' },
  { seg: 'Papel', desc: 'CRI (Certificados de Recebíveis Imobiliários) e LCI. Renda fixa imobiliária — menos sujeito a vacância.' },
  { seg: 'FOF', desc: 'Fund of Funds — investe em cotas de outros FIIs. Diversificação automática mas com dupla camada de taxas.' },
  { seg: 'Hibrido', desc: 'Combina dois ou mais tipos de ativos imobiliários.' },
];

export default function GuiaListaFiis() {
  return (
    <Box sx={{ py: 3, maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Como usar a Lista de FIIs
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        A Lista de Fundos de Investimento Imobiliário (FIIs) exibe os principais indicadores para avaliação de fundos listados na B3. Entender as colunas específicas de FIIs é fundamental para uma boa analise.
      </Typography>

      <SectionTitle>Colunas específicas de FIIs</SectionTitle>
      <Divider sx={{ mb: 2 }} />
      <Table size="small" sx={{ mb: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, width: '22%' }}>Coluna</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>O que representa</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {COLUNAS_FII.map((row) => (
            <TableRow key={row.col} hover>
              <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{row.col}</TableCell>
              <TableCell><Typography variant="body2">{row.desc}</Typography></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
        Diferente das ações, os FIIs <strong>não possuem Análise ML</strong> (o modelo de machine learning foi treinado apenas com ações do Ibovespa). A avaliacao de FIIs baseia-se principalmente em DY, P/VP e vacancia.
      </InfoCard>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Segmentos de FIIs</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            O segmento define a estratégia de investimento do fundo. Cada segmento tem características de risco e retorno diferentes:
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: '28%' }}>Segmento</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Característica</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {SEGMENTOS.map((row) => (
                <TableRow key={row.seg} hover>
                  <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{row.seg}</TableCell>
                  <TableCell><Typography variant="body2">{row.desc}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            Use o filtro de segmento para comparar FIIs do mesmo tipo. Comparar um FII de Papel com um de Tijolo pode ser enganoso, pois os riscos e a dinâmica de rendimentos sao muito diferentes.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Como filtrar por segmento e buscar</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            O filtro de <strong>Segmento</strong> na barra de ferramentas da tabela permite selecionar um ou mais segmentos. Ao selecionar "Logística", por exemplo, apenas os FIIs logísticos aparecerão na tabela.
          </Typography>
          <Typography variant="body2" paragraph>
            A barra de busca filtra por ticker ou nome do fundo em tempo real. Digite "HGLG" para encontrar o HGLG11, ou "kinea" para ver os fundos da gestora Kinea.
          </Typography>
          <Typography variant="body2" paragraph>
            As colunas podem ser ordenadas clicando nos cabeçalhos. Ordenar por <strong>DY 12M decrescente</strong> mostra os FIIs com maior Dividend Yield no topo — mas atenção ao DY alto causado por queda de preço (dividend trap).
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Como favoritar e acessar o detalhe</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Clique no ícone de estrela em cada linha para adicionar o FII aos seus favoritos. Os FIIs favoritados aparecem na página <strong>FIIs Favoritos</strong> no menu lateral.
          </Typography>
          <Typography variant="body2" paragraph>
            Para acessar o detalhe de um FII, clique em qualquer ponto da linha (ou no ticker). A página de detalhe exibe todos os indicadores do fundo, historico de rendimentos e outras informacoes relevantes.
          </Typography>
          <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
            A pagina de detalhe de FII nao possui grafico de candlestick, pois o pipeline de dados do InvestLink coleta historico de precos apenas para acoes.
          </InfoCard>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
