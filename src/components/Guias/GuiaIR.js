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

const RESUMO_IR = [
  { ativo: 'Acoes — Swing Trade', aliquota: '15%', base: 'Lucro na venda', isencao: 'Vendas ate R$ 20.000/mes no total de acoes sao isentas', obs: 'DARF codigo 6015' },
  { ativo: 'Acoes — Day Trade', aliquota: '20%', base: 'Lucro na venda no mesmo dia', isencao: 'Sem isencao', obs: 'DARF codigo 6015. IRRFonte 1% sobre o lucro bruto' },
  { ativo: 'Dividendos de Acoes (PF)', aliquota: 'Isento*', base: '—', isencao: 'Isentos na legislacao atual', obs: '*Pode mudar com reformas tributarias' },
  { ativo: 'JCP de Acoes', aliquota: '15%', base: 'Valor recebido', isencao: 'Sem isencao', obs: 'IR retido na fonte pela empresa' },
  { ativo: 'FIIs — Rendimentos mensais', aliquota: 'Isento*', base: '—', isencao: 'Isento para PF se fundo com 50+ cotistas e cotista nao tem mais de 10% das cotas', obs: '*Condicoes devem ser respeitadas' },
  { ativo: 'FIIs — Ganho de capital na venda', aliquota: '20%', base: 'Lucro na venda de cotas', isencao: 'Sem isencao de R$ 20k/mes', obs: 'DARF codigo 6015' },
];

export default function GuiaIR() {
  return (
    <Box sx={{ py: 3, maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Imposto de Renda em Investimentos
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Entender a tributacao e essencial para nao ter surpresas no IRPF e para calcular o retorno real dos investimentos. Este guia cobre as regras basicas para acoes e FIIs.
      </Typography>

      <InfoCard icon={<WarningAmberOutlinedIcon />} color="warning.main">
        Este guia e educativo e pode conter simplificacoes. As regras tributarias mudam com frequencia. Consulte sempre um contador especializado em investimentos e a legislacao vigente antes de tomar decisoes fiscais.
      </InfoCard>

      <SectionTitle>Resumo da tributacao</SectionTitle>
      <Divider sx={{ mb: 2 }} />
      <Table size="small" sx={{ mb: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, width: '25%' }}>Ativo / Operacao</TableCell>
            <TableCell sx={{ fontWeight: 700, width: '12%' }}>Aliquota</TableCell>
            <TableCell sx={{ fontWeight: 700, width: '20%' }}>Base de calculo</TableCell>
            <TableCell sx={{ fontWeight: 700, width: '25%' }}>Isencao</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Obs.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {RESUMO_IR.map((row) => (
            <TableRow key={row.ativo} hover>
              <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{row.ativo}</TableCell>
              <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2" fontWeight={600}>{row.aliquota}</Typography></TableCell>
              <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{row.base}</Typography></TableCell>
              <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{row.isencao}</Typography></TableCell>
              <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{row.obs}</Typography></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Acoes — regra da isencao de R$ 20.000/mes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Vendas de acoes (mercado a vista, swing trade) ate R$ 20.000 no mes sao isentas de IR. Esta regra se aplica ao <strong>valor total vendido</strong> no mes, nao ao lucro.
          </Typography>
          <Typography variant="body2" paragraph>
            Exemplo: voce vende R$ 15.000 em acoes com lucro de R$ 3.000 no mes — nenhum IR a pagar. Se vender R$ 25.000 com lucro de R$ 5.000, deve pagar 15% sobre os R$ 5.000 = R$ 750.
          </Typography>
          <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
            A isencao e calculada sobre o total de vendas de acoes no mes (todos os ativos somados), nao por ativo individual. Day trade nao entra nesse calculo e nunca tem isencao.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>DARF — quando e como pagar</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            O DARF (Documento de Arrecadacao de Receitas Federais) e o documento usado para recolher o IR sobre ganho de capital. Voce mesmo deve calcular e pagar — a corretora nao faz isso automaticamente (exceto o IRRFonte do day trade).
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Prazo:</strong> ate o ultimo dia util do mes seguinte ao mes da venda com lucro.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Codigo DARF para acoes e FIIs:</strong> 6015.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Valor minimo:</strong> DARFs abaixo de R$ 10,00 podem ser acumulados para o mes seguinte.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Como pagar:</strong> pelo site ou app da Receita Federal, pelo portal e-CAC, ou por qualquer banco.
            </Typography>
          </Box>
          <InfoCard icon={<WarningAmberOutlinedIcon />} color="warning.main">
            Atraso no pagamento gera multa de 0,33% ao dia (limite de 20%) mais juros pela taxa Selic. Nao deixe para a declaracao anual do IRPF — o DARF mensal e separado e obrigatorio.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Prejuizo — como abater de lucros futuros</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Perdas realizadas na venda de acoes podem ser compensadas com lucros futuros da mesma categoria. As regras:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Mesma categoria:</strong> prejuizo de swing trade compensa lucro de swing trade. Prejuizo de day trade compensa lucro de day trade. Nao e possivel cruzar as categorias.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Sem prazo de vencimento:</strong> os prejuizos acumulados podem ser compensados em qualquer mes futuro, sem prazo limite.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Controle:</strong> mantenha o historico de prejuizos em planilha ou use o informe de rendimentos da corretora para o IRPF.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>FIIs:</strong> prejuizo de FIIs compensa lucro de FIIs (nao de acoes).
            </Typography>
          </Box>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            Use a aba Historico da Minha Carteira para registrar suas transacoes de COMPRA e VENDA. Isso facilita o calculo do resultado realizado e o controle do saldo de prejuizos para compensacao.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Declaracao anual do IRPF</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Alem do DARF mensal, e necessario declarar os investimentos na Declaracao Anual do Imposto de Renda (prazo usual: marco a abril do ano seguinte). Os principais campos:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Bens e Direitos:</strong> informar todas as acoes e FIIs na carteira em 31/12 pelo custo de aquisicao (nao pelo preco de mercado).
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Rendimentos Isentos:</strong> dividendos de acoes e rendimentos mensais de FIIs isentos.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Rendimentos Tributaveis:</strong> JCP recebido (ja com retencao na fonte).
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Renda Variavel:</strong> resumo mensal de operacoes, IR pago via DARF e saldo de prejuizos.
            </Typography>
          </Box>
          <InfoCard icon={<WarningAmberOutlinedIcon />} color="warning.main">
            O informe de rendimentos da sua corretora (disponivel em janeiro/fevereiro de cada ano) e o documento base para preencher a declaracao. Guarde todos os informes.
          </InfoCard>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
