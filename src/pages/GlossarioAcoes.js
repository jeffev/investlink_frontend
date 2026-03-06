import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SECTIONS = [
  {
    title: 'Identificação',
    fields: [
      { col: 'Ticker', desc: 'Código de negociação da ação na bolsa (ex: PETR4, VALE3).' },
      { col: 'Nome', desc: 'Razão social da empresa.' },
      { col: 'Setor', desc: 'Setor econômico de atuação da empresa (ex: Petróleo, Bancos).' },
      { col: 'Subsetor', desc: 'Divisão mais específica dentro do setor.' },
      { col: 'Segmento', desc: 'Segmento de listagem na B3 (ex: Novo Mercado, Nível 2).' },
    ],
  },
  {
    title: 'Preço e Valor de Mercado',
    fields: [
      { col: 'Preço', desc: 'Cotação atual da ação em reais.' },
      { col: 'Valor Mercado', desc: 'Valor total de mercado da empresa (preço × número de ações).' },
      { col: 'VPA', desc: 'Valor Patrimonial por Ação — patrimônio líquido dividido pelo número de ações. Representa o valor contábil por ação.' },
      { col: 'LPA', desc: 'Lucro por Ação — lucro líquido dividido pelo número de ações.' },
      { col: 'PVP', desc: 'Preço/Valor Patrimonial — relação entre o preço de mercado e o valor patrimonial por ação. Abaixo de 1 pode indicar subavaliação contábil.' },
      { col: 'PL', desc: 'Preço/Lucro — quantos anos de lucro atual equivalem ao preço da ação. Valores menores indicam ação potencialmente mais barata.' },
      { col: 'Fórmula Graham', desc: 'Preço justo calculado pela fórmula de Benjamin Graham: √(22,5 × LPA × VPA). Referência clássica de valuation conservador.' },
      { col: 'Desconto Fórmula Graham', desc: 'Percentual de desconto (verde) ou prêmio (vermelho) do preço atual em relação ao preço justo de Graham. Negativo = ação abaixo do preço justo.' },
    ],
  },
  {
    title: 'Rentabilidade',
    fields: [
      { col: 'ROE', desc: 'Return on Equity — rentabilidade sobre o patrimônio líquido (lucro líquido / patrimônio). Mede eficiência da empresa em gerar lucro com seus recursos próprios.' },
      { col: 'ROA', desc: 'Return on Assets — rentabilidade sobre os ativos totais. Indica quão eficientemente a empresa usa seus ativos para gerar lucro.' },
      { col: 'ROIC', desc: 'Return on Invested Capital — retorno sobre o capital investido. Mede a eficiência de geração de lucro operacional sobre o capital empregado (dívida + patrimônio).' },
      { col: 'DY', desc: 'Dividend Yield — dividendos pagos nos últimos 12 meses divididos pelo preço atual. Indica o retorno em dividendos.' },
    ],
  },
  {
    title: 'Margens',
    fields: [
      { col: 'Margem Bruta', desc: 'Lucro bruto / receita líquida. Mede quanto sobra da receita após deduzir o custo dos produtos/serviços vendidos.' },
      { col: 'Margem EBIT', desc: 'EBIT / receita líquida. EBIT é o lucro antes dos juros e impostos. Indica a rentabilidade operacional.' },
      { col: 'Margem Líquida', desc: 'Lucro líquido / receita líquida. Percentual da receita que efetivamente se converte em lucro final.' },
    ],
  },
  {
    title: 'Múltiplos de Valuation',
    fields: [
      { col: 'P/EBIT', desc: 'Preço / EBIT — múltiplo que relaciona o valor de mercado ao lucro operacional. Alternativa ao P/L para comparações entre empresas com estruturas tributárias diferentes.' },
      { col: 'P/Ativo', desc: 'Preço / Ativo Total — relação entre o valor de mercado e o total de ativos da empresa.' },
      { col: 'EV/EBIT', desc: 'Enterprise Value / EBIT — compara o valor total da empresa (incluindo dívidas) ao seu lucro operacional. Muito usado para comparar empresas com diferentes níveis de alavancagem.' },
      { col: 'Capital de Giro', desc: 'P/Capital de Giro — relação entre o preço e o capital de giro líquido (ativo circulante − passivo circulante).' },
      { col: 'Ativo Circulante', desc: 'P/Ativo Circulante — relação entre o preço e os ativos de curto prazo da empresa.' },
      { col: 'PEG Ratio', desc: 'P/L dividido pela taxa de crescimento do lucro. Valores abaixo de 1 podem indicar que a ação está barata em relação ao seu crescimento esperado.' },
    ],
  },
  {
    title: 'Endividamento e Liquidez',
    fields: [
      { col: 'Dívida líquida/Patrimônio', desc: 'Dívida líquida dividida pelo patrimônio líquido. Mede o nível de alavancagem da empresa. Valores altos indicam maior dependência de capital de terceiros.' },
      { col: 'Dívida líquida/EBITDA', desc: 'Dívida líquida dividida pelo EBITDA. Indica quantos anos de geração de caixa operacional seriam necessários para quitar a dívida líquida.' },
      { col: 'PL/Ativo', desc: 'Patrimônio Líquido / Ativo Total — proporção do ativo financiada com recursos próprios. Complemento do Passivo/Ativo.' },
      { col: 'Ativo/Passivo', desc: 'Relação entre passivo total e ativo total. Mede a proporção do ativo financiada por dívidas.' },
      { col: 'Liquidez Corrente', desc: 'Ativo circulante / passivo circulante. Acima de 1 indica que a empresa consegue honrar suas obrigações de curto prazo.' },
      { col: 'Giro de Ativo', desc: 'Receita líquida / ativo total. Mede a eficiência da empresa em gerar receita a partir de seus ativos.' },
    ],
  },
  {
    title: 'Crescimento',
    fields: [
      { col: 'CAGR Receitas 5 anos', desc: 'Compound Annual Growth Rate da receita líquida nos últimos 5 anos. Taxa de crescimento anual composta — indica a velocidade de expansão das receitas.' },
    ],
  },
  {
    title: 'Fórmula Mágica (Joel Greenblatt)',
    intro:
      'A Fórmula Mágica é uma estratégia de investimento quantitativa criada por Joel Greenblatt. Ela combina dois critérios para encontrar boas empresas a preços atrativos: alta rentabilidade sobre o capital (ROIC) e alto earnings yield (EY). Cada empresa recebe um ranking em cada critério; a soma dos rankings define o rank final (menor = melhor).',
    fields: [
      { col: 'Rank ROIC', desc: 'Posição da empresa ordenada pelo ROIC (do maior para o menor). Menor valor = empresa mais rentável sobre o capital investido.' },
      { col: 'Earnings Rank', desc: 'Posição da empresa ordenada pelo Earnings Yield (EBIT / Enterprise Value). Menor valor = ação mais barata em relação ao lucro operacional.' },
      { col: 'Rank Fórmula Mágica', desc: 'Soma do Rank ROIC + Earnings Rank. Menor valor = melhor combinação de qualidade e preço segundo a metodologia de Greenblatt.' },
    ],
  },
  {
    title: 'Análise por Inteligência Artificial',
    intro:
      'Modelo de machine learning (GradientBoosting/XGBoost) treinado com dados históricos de indicadores fundamentalistas e retornos relativos ao Ibovespa. O modelo classifica cada ação com base em seus fundamentos atuais.',
    fields: [
      {
        col: 'Análise ML',
        desc: (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2">Classificação do modelo de IA:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="BARATA" color="success" size="small" />
              <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                — modelo prevê retorno superior ao Ibovespa em +15% ou mais.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="NEUTRA" color="primary" size="small" />
              <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                — retorno esperado próximo ao do Ibovespa.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="CARA" color="error" size="small" />
              <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                — modelo prevê retorno inferior ao Ibovespa em -15% ou mais.
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Passe o mouse sobre o chip para ver as probabilidades individuais de cada classe.
            </Typography>
          </Box>
        ),
      },
      {
        col: 'Score',
        desc: 'Pontuação composta (0–100) calculada pelo pipeline de feature engineering. Combina quatro dimensões: Valor (30%), Qualidade (35%), Crescimento (20%) e Dividendos (15%). Scores mais altos indicam fundamentos mais sólidos.',
      },
    ],
  },
];

export default function GlossarioAcoes() {
  return (
    <Box sx={{ py: 3, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom fontWeight={700}>
        Glossário — Lista de Ações
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Descrição de todos os indicadores e colunas disponíveis na lista de ações.
      </Typography>

      {SECTIONS.map((section) => (
        <Accordion key={section.title} defaultExpanded={false} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>{section.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {section.intro && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {section.intro}
              </Typography>
            )}
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: '28%' }}>Coluna</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Descrição</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {section.fields.map((f) => (
                  <TableRow key={f.col} hover>
                    <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{f.col}</TableCell>
                    <TableCell>
                      {typeof f.desc === 'string' ? (
                        <Typography variant="body2">{f.desc}</Typography>
                      ) : (
                        f.desc
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
