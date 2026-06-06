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

const RETORNOS = [
  {
    metrica: 'ROE',
    nome: 'Return on Equity',
    formula: 'Lucro Liquido / Patrimonio Liquido',
    mede: 'Quanto a empresa gera de lucro para cada real de patrimonio dos acionistas.',
    referencia: 'ROE > 15% e considerado bom. Bancos tipicamente tem ROE entre 15% e 25%.',
  },
  {
    metrica: 'ROA',
    nome: 'Return on Assets',
    formula: 'Lucro Liquido / Ativo Total',
    mede: 'Eficiencia no uso de todos os ativos (proprios e financiados por divida) para gerar lucro.',
    referencia: 'ROA > 5% e razoavel. Empresas asset-heavy (siderurgia, energia) tem ROA menor.',
  },
  {
    metrica: 'ROIC',
    nome: 'Return on Invested Capital',
    formula: 'NOPAT / (Patrimonio Liquido + Divida Liquida)',
    mede: 'Retorno gerado sobre todo o capital investido na operacao (divida + patrimonio). Melhor metrica de criacao de valor.',
    referencia: 'ROIC > WACC (custo de capital): empresa cria valor. ROIC > 12% e referencia para boas empresas.',
  },
];

const MARGENS = [
  {
    margem: 'Margem Bruta',
    formula: 'Lucro Bruto / Receita Liquida',
    indica: 'O poder de precificacao da empresa e o custo relativo dos produtos/servicos. Alta margem bruta indica vantagem competitiva no produto.',
    exemplo: 'Software: 70%+ | Varejo: 20–40% | Siderurgia: 15–25%',
  },
  {
    margem: 'Margem EBIT',
    formula: 'EBIT / Receita Liquida',
    indica: 'A lucratividade operacional antes dos efeitos financeiros e tributarios. Mostra a eficiencia da operacao principal.',
    exemplo: 'Bom: > 15% | Fraco: < 5% (varia muito por setor)',
  },
  {
    margem: 'Margem Liquida',
    formula: 'Lucro Liquido / Receita Liquida',
    indica: 'Percentual da receita que efetivamente se torna lucro apos todos os custos, despesas, juros e impostos.',
    exemplo: 'Bancos: 20–30% | Varejo alimentar: 2–5% | Tecnologia: 10–25%',
  },
];

export default function GuiaRentabilidade() {
  return (
    <Box sx={{ py: 3, maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Rentabilidade — ROE, ROA, ROIC e Margens
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        As metricas de rentabilidade medem a capacidade da empresa de gerar lucro a partir de seus recursos. Sao indicadores fundamentais da qualidade do negocio.
      </Typography>

      <SectionTitle>Retornos sobre capital: ROE, ROA e ROIC</SectionTitle>
      <Divider sx={{ mb: 2 }} />
      <Table size="small" sx={{ mb: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, width: '10%' }}>Metrica</TableCell>
            <TableCell sx={{ fontWeight: 700, width: '22%' }}>Formula</TableCell>
            <TableCell sx={{ fontWeight: 700, width: '32%' }}>O que mede</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Referencia</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {RETORNOS.map((row) => (
            <TableRow key={row.metrica} hover>
              <TableCell sx={{ fontWeight: 600, verticalAlign: 'top' }}>{row.metrica}</TableCell>
              <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{row.formula}</Typography></TableCell>
              <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{row.mede}</Typography></TableCell>
              <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{row.referencia}</Typography></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Por que o ROIC e a metrica mais importante</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            O ROIC e considerado a metrica de rentabilidade mais completa porque considera o <strong>capital total empregado no negocio</strong>, incluindo a divida. O ROE pode ser distorcido por empresas muito alavancadas.
          </Typography>
          <Typography variant="body2" paragraph>
            A regra de ouro do ROIC:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>ROIC {'>'} WACC:</strong> a empresa gera mais retorno do que o custo do capital investido — esta criando valor para o acionista.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>ROIC {'<'} WACC:</strong> a empresa destroi valor — mesmo que tenha lucro, o retorno e menor que o custo de oportunidade do capital.
            </Typography>
          </Box>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            O WACC (custo medio ponderado de capital) varia por empresa e cenario de juros. No Brasil com Selic alta, o custo de capital e tipicamente 12–18%, tornando a exigencia de ROIC mais alta que em paises com juros baixos.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Margens: o que cada uma revela sobre o negocio</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small" sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: '22%' }}>Margem</TableCell>
                <TableCell sx={{ fontWeight: 700, width: '28%' }}>Formula</TableCell>
                <TableCell sx={{ fontWeight: 700, width: '28%' }}>O que indica</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Exemplos setoriais</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MARGENS.map((row) => (
                <TableRow key={row.margem} hover>
                  <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{row.margem}</TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{row.formula}</Typography></TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{row.indica}</Typography></TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{row.exemplo}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
            Compare margens sempre dentro do mesmo setor. Uma margem liquida de 3% e excelente para o varejo alimentar, mas seria preocupante para uma empresa de software.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Armadilha: ROE alto por alavancagem</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Uma empresa pode ter ROE elevado simplesmente por ter muito pouco patrimonio liquido (alta alavancagem), e nao porque e rentavel. Exemplo:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              Empresa A: lucro R$ 100 | patrimonio R$ 500 → ROE = 20% (por eficiencia real)
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              Empresa B: lucro R$ 100 | patrimonio R$ 100 → ROE = 100% (por patrimonio muito pequeno)
            </Typography>
          </Box>
          <Typography variant="body2" paragraph>
            Se a Empresa B tem R$ 900 de divida para financiar seus ativos, o ROE de 100% esconde um risco enorme.
          </Typography>
          <Typography variant="body2">
            Para detectar ROE inflado por alavancagem, compare o ROE com o ROIC e verifique o indicador <strong>Divida Liquida/Patrimonio</strong>. Um ROE muito acima do ROIC e um sinal de alerta.
          </Typography>
          <InfoCard icon={<WarningAmberOutlinedIcon />} color="warning.main">
            Sempre analise o ROE junto com o nivel de endividamento (Divida Liquida / EBITDA e Divida Liquida / PL). ROE alto em empresa muito alavancada pode indicar fragilidade financeira.
          </InfoCard>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
