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

const MULTIPLOS = [
  {
    multiplo: 'P/L',
    formula: 'Preco / Lucro por Acao',
    mede: 'Quantos anos de lucro atual equivalem ao preco da acao.',
    referencia: 'P/L < 10: barato | 10–20: razoavel | > 20: caro (varia por setor)',
  },
  {
    multiplo: 'P/VP',
    formula: 'Preco / Valor Patrimonial por Acao',
    mede: 'Quanto o mercado paga em relacao ao valor contabil da empresa.',
    referencia: 'P/VP < 1: abaixo do valor contabil | > 3: preco ja incorpora muito crescimento esperado',
  },
  {
    multiplo: 'EV/EBITDA',
    formula: 'Enterprise Value / EBITDA',
    mede: 'Quanto o mercado paga pelo resultado operacional antes de juros, depreciacoes e impostos.',
    referencia: 'EV/EBITDA < 6: barato | 6–12: moderado | > 12: elevado',
  },
  {
    multiplo: 'EV/EBIT',
    formula: 'Enterprise Value / EBIT',
    mede: 'Semelhante ao EV/EBITDA, mas considera a depreciacoes — mais conservador.',
    referencia: 'EV/EBIT < 10: atrativo | > 15: elevado (sem considerar setor)',
  },
  {
    multiplo: 'P/EBIT',
    formula: 'Preco de Mercado / EBIT',
    mede: 'Relacao entre valor de mercado e lucro operacional. Util para comparar empresas com estruturas tributarias diferentes.',
    referencia: 'Menor e melhor. Compare sempre dentro do mesmo setor.',
  },
];

export default function GuiaValuation() {
  return (
    <Box sx={{ py: 3, maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Valuation — Como avaliar o preco justo de uma acao
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Valuation e o processo de estimar o valor intrinseco de uma empresa para determinar se suas acoes estao caras ou baratas em relacao ao preco de mercado.
      </Typography>

      <SectionTitle>O que e valuation</SectionTitle>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body2" paragraph>
        Uma acao pode estar negociada a um <strong>preco diferente do valor real da empresa</strong>. Valuation e o conjunto de tecnicas para estimar esse valor real e compara-lo com o preco de mercado.
      </Typography>
      <Typography variant="body2" paragraph>
        Se o valor estimado e maior que o preco atual, a acao pode estar subavaliada (oportunidade). Se o preco e muito maior que o valor estimado, pode estar sobreavaliada (risco de queda).
      </Typography>
      <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
        Nenhum metodo de valuation e preciso. Cada um parte de premissas diferentes e tem seus pontos cegos. O ideal e usar varios metodos em conjunto para triangular uma estimativa razoavel.
      </InfoCard>

      <SectionTitle>Os principais multiplos de valuation</SectionTitle>
      <Divider sx={{ mb: 2 }} />
      <Table size="small" sx={{ mb: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, width: '12%' }}>Multiplo</TableCell>
            <TableCell sx={{ fontWeight: 700, width: '25%' }}>Formula</TableCell>
            <TableCell sx={{ fontWeight: 700, width: '30%' }}>O que mede</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Referencias</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {MULTIPLOS.map((row) => (
            <TableRow key={row.multiplo} hover>
              <TableCell sx={{ fontWeight: 600, verticalAlign: 'top' }}>{row.multiplo}</TableCell>
              <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{row.formula}</Typography></TableCell>
              <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{row.mede}</Typography></TableCell>
              <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{row.referencia}</Typography></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Formula de Graham</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Benjamin Graham, o pai do value investing, criou uma formula simples para estimar o preco justo de uma acao:
          </Typography>
          <Box sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 2, mb: 2 }}>
            <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
              Preco Justo = Raiz quadrada(22,5 x LPA x VPA)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              LPA = Lucro por Acao | VPA = Valor Patrimonial por Acao
            </Typography>
          </Box>
          <Typography variant="body2" paragraph>
            O numero 22,5 vem da multiplicacao de um P/L maximo de 15 por um P/VP maximo de 1,5 (o que Graham considerava o limite de preco aceitavel).
          </Typography>
          <Typography variant="body2" paragraph>
            Se o preco atual for menor que o preco justo calculado, a acao tem um <strong>desconto em relacao ao Graham</strong> — o InvestLink exibe esse desconto na coluna "Desconto Fórmula Graham" da lista de acoes.
          </Typography>
          <InfoCard icon={<WarningAmberOutlinedIcon />} color="warning.main">
            A formula de Graham e conservadora e foi criada em uma epoca diferente. Nao funciona bem para empresas de crescimento elevado (que naturalmente negociam com P/L alto) nem para empresas com prejuizo (LPA negativo). Trate como uma referencia, nao como um valor absoluto.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>A armadilha do P/L baixo</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Um P/L muito baixo pode indicar que a acao esta barata — ou que o mercado espera uma queda nos lucros futuros. Algumas situacoes de "P/L baixo" que merecem cuidado:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Empresa ciclica no pico:</strong> setores como mineracao e petroleo tem lucros que oscilam com o ciclo de commodities. Um P/L baixo no pico do ciclo pode mascarar quedas futuras.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Lucro nao recorrente:</strong> se o lucro atual inclui uma venda de ativo ou ganho extraordinario, o LPA nao representa a rentabilidade normal da empresa.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Empresa em declinio:</strong> o mercado pode estar precificando corretamente a deterioracao do negocio.
            </Typography>
          </Box>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            Sempre verifique a qualidade e a consistencia dos lucros antes de concluir que um P/L baixo representa uma oportunidade.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Comparacao setorial — por que importa</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Diferentes setores negociam naturalmente com multiplos diferentes. Comparar o P/L de uma empresa de energia eletrica com o de um banco ou de uma empresa de tecnologia e enganoso.
          </Typography>
          <Table size="small" sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Setor</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>P/L tipico historico</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Razao</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Energia Eletrica', '10–15', 'Negocio regulado, baixo crescimento, alta previsibilidade'],
                ['Bancos', '8–12', 'Lucros mais previsíveis, alavancagem natural do setor'],
                ['Varejo', '15–25', 'Maior crescimento esperado, mais exposicao ao ciclo economico'],
                ['Tecnologia', '25–50+', 'Alto crescimento esperado precificado no preco atual'],
              ].map(([setor, pl, razao]) => (
                <TableRow key={setor} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{setor}</TableCell>
                  <TableCell><Typography variant="body2">{pl}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{razao}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography variant="body2">
            O InvestLink normaliza os indicadores por setor para o calculo do Score, evitando distorcoes entre setores com multiplos historicamente diferentes.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
