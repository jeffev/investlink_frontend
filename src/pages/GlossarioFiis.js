import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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
      { col: 'Ticker', desc: 'Código de negociação do FII na bolsa (ex: MXRF11, HGLG11). Sempre terminam com 11.' },
      { col: 'Nome', desc: 'Nome do fundo de investimento imobiliário.' },
      { col: 'Setor', desc: 'Setor de atuação do FII (ex: Logística, Shoppings, Lajes Corporativas, Recebíveis).' },
      { col: 'Subsetor', desc: 'Divisão mais específica dentro do setor.' },
      { col: 'Segmento', desc: 'Tipo de estratégia do fundo: Tijolo (imóveis físicos), Papel (CRIs e títulos de crédito) ou Híbrido.' },
    ],
  },
  {
    title: 'Preço e Valor',
    fields: [
      { col: 'Preço', desc: 'Cotação atual da cota do FII em reais.' },
      {
        col: 'Valor Patrimonial Cota',
        desc: 'Valor patrimonial por cota (VPC) — patrimônio líquido do fundo dividido pelo número de cotas emitidas. Representa o valor "contábil" de cada cota com base nos ativos do fundo.',
      },
      {
        col: 'P/VP',
        desc: 'Preço / Valor Patrimonial — relação entre a cotação e o valor patrimonial por cota. Abaixo de 1 significa que o fundo é negociado com desconto em relação ao seu patrimônio. Acima de 1 significa que o mercado paga um prêmio.',
      },
    ],
  },
  {
    title: 'Rendimentos',
    fields: [
      {
        col: 'DY',
        desc: 'Dividend Yield — soma dos dividendos distribuídos nos últimos 12 meses dividida pela cotação atual. Principal métrica para avaliar o retorno em proventos de um FII. FIIs são obrigados por lei a distribuir pelo menos 95% dos lucros semestralmente.',
      },
      {
        col: 'Último Dividendo',
        desc: 'Valor do dividendo distribuído na última competência (mês ou semestre, dependendo do fundo). Expresso em reais por cota.',
      },
      {
        col: 'Dividend CAGR',
        desc: 'Compound Annual Growth Rate dos dividendos — taxa de crescimento anual composta dos proventos distribuídos. Indica se o fundo tem conseguido aumentar seus rendimentos ao longo do tempo.',
      },
    ],
  },
  {
    title: 'Crescimento',
    fields: [
      {
        col: 'Cota CAGR',
        desc: 'Taxa de crescimento anual composta da cotação da cota. Mede a valorização (ou desvalorização) do preço da cota ao longo do tempo, independente dos dividendos recebidos.',
      },
    ],
  },
  {
    title: 'Liquidez e Escala',
    fields: [
      {
        col: 'Liquidez Média Diária',
        desc: 'Volume médio negociado diariamente em reais. Fundos com alta liquidez são mais fáceis de comprar e vender sem impactar o preço. Referência: acima de R$ 1 milhão/dia é considerado bom para a maioria dos investidores.',
      },
      {
        col: 'Número Cotistas',
        desc: 'Quantidade de cotistas (investidores) cadastrados no fundo. Um número elevado e crescente indica popularidade e pulverização da base, o que geralmente contribui para maior liquidez.',
      },
      {
        col: 'Número Cotas',
        desc: 'Quantidade total de cotas emitidas pelo fundo. Junto com o patrimônio, determina o valor patrimonial por cota.',
      },
      {
        col: 'Patrimônio',
        desc: 'Patrimônio líquido total do fundo em reais. Representa o valor total dos ativos do fundo deduzido de suas obrigações. Fundos maiores tendem a ter mais diversificação e liquidez.',
      },
    ],
  },
  {
    title: 'Gestão de Caixa',
    fields: [
      {
        col: '% Caixa',
        desc: 'Percentual do patrimônio do fundo mantido em caixa ou equivalentes (títulos de renda fixa de curto prazo). Um percentual alto pode indicar que o fundo está aguardando oportunidades de aquisição, mas também pode reduzir o rendimento distribuído. Fundos de papel naturalmente têm % caixa diferente de fundos de tijolo.',
      },
    ],
  },
];

export default function GlossarioFiis() {
  return (
    <Box sx={{ py: 3, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom fontWeight={700}>
        Glossário — Lista de FIIs
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
        Descrição de todos os indicadores e colunas disponíveis na lista de Fundos de Investimento Imobiliário.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        FIIs são fundos que investem em ativos imobiliários — imóveis físicos (Tijolo), títulos de crédito imobiliário (Papel) ou uma combinação dos dois (Híbrido). Cotas são negociadas na B3 como ações.
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
                      <Typography variant="body2">{f.desc}</Typography>
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
