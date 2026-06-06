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

const TIPOS_ACOES = [
  { tipo: 'ON (Ordinaria)', sufixo: 'Termina em 3 — ex: PETR3', desc: 'Da direito a voto nas assembleias da empresa. Em caso de venda da empresa (tag along), o acionista ON deve receber ao menos 100% do preco pago pelo controlador.' },
  { tipo: 'PN (Preferencial)', sufixo: 'Termina em 4 — ex: PETR4', desc: 'Sem direito a voto, mas tem preferencia no recebimento de dividendos. Historicamente mais liquida em muitas empresas.' },
  { tipo: 'Unit', sufixo: 'Termina em 11 — ex: BPAC11', desc: 'Certificado de deposito que representa um conjunto de acoes ON e PN. Muito comum nos bancos.' },
];

export default function GuiaOQueSaoAcoes() {
  return (
    <Box sx={{ py: 3, maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        O que sao Acoes
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Uma introducao ao mercado de acoes brasileiro: o que e uma acao, como funciona a B3, como as acoes geram retorno e quais sao os principais riscos.
      </Typography>

      <SectionTitle>O que e uma acao</SectionTitle>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body2" paragraph>
        Uma acao e uma <strong>fracao do capital social de uma empresa</strong>. Ao comprar acoes de uma empresa, voce se torna socio (acionista) dela na proporcao das acoes que possui. Se a empresa tem 1 bilhao de acoes e voce possui 1.000 delas, voce e dono de 0,0001% da empresa.
      </Typography>
      <Typography variant="body2" paragraph>
        Como socio, voce participa dos resultados da empresa: se ela lucrar, o valor das acoes tende a subir e voce pode receber dividendos. Se ela tiver prejuizos, o valor pode cair.
      </Typography>
      <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
        O retorno de uma acao vem de duas fontes: <strong>valorizacao do preco</strong> (a acao vale mais do que voce pagou) e <strong>dividendos</strong> (distribuicao dos lucros da empresa).
      </InfoCard>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Tipos de acoes: ON, PN e Unit</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small" sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: '25%' }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 700, width: '30%' }}>Sufixo / Exemplo</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Caracteristica</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {TIPOS_ACOES.map((row) => (
                <TableRow key={row.tipo} hover>
                  <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{row.tipo}</TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{row.sufixo}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{row.desc}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            Para a maioria dos investidores pessoas fisicas, a diferenca pratica entre ON e PN e pequena no dia a dia. O mais importante e escolher a acao com maior liquidez (volume de negociacoes diario) da empresa.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>O que e a B3 e como funciona o pregao</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            A <strong>B3 (Brasil, Bolsa, Balcao)</strong> e a unica bolsa de valores do Brasil. E onde as acoes de empresas abertas sao negociadas. Quando voce compra uma acao pelo seu home broker, a transacao e executada e liquidada pela B3.
          </Typography>
          <Typography variant="body2" paragraph>
            O pregao funciona de segunda a sexta, das 10h00 as 17h00 (horario de Brasilia), com um periodo de pre-abertura das 09h45 as 10h00. Fora desse horario, as ordens ficam agendadas para o proximo pregao.
          </Typography>
          <Typography variant="body2" paragraph>
            A liquidacao financeira (o dinheiro efetivamente mudar de conta) ocorre em <strong>D+2</strong> — dois dias uteis apos a negociacao.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Como uma acao ganha (ou perde) valor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            O preco de uma acao e determinado pela oferta e demanda no mercado. Mas no longo prazo, o preco tende a convergir para o <strong>valor intrinseco</strong> da empresa, que depende de:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Lucros e crescimento:</strong> empresas que crescem o lucro consistentemente tendem a ter acoes valorizadas ao longo do tempo.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Dividendos:</strong> a distribuicao de lucros remunera o acionista diretamente.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Expectativas:</strong> o mercado precifica o futuro. Boas perspectivas de crescimento elevam o preco mesmo antes dos lucros aparecerem.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Taxa de juros:</strong> juros altos tornam a renda fixa mais atrativa, reduzindo o apetite por acoes e pressionando os precos para baixo.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Riscos do investimento em acoes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Acoes sao ativos de risco. Os principais fatores que podem causar queda no valor:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}><strong>Risco da empresa:</strong> resultados piores que o esperado, escandalo de gestao, perda de market share.</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}><strong>Risco setorial:</strong> crise especifica do setor (regulatoria, tecnologica, crise de commodities).</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}><strong>Risco macroeconomico:</strong> recessao, inflacao alta, alta de juros, crise cambial.</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}><strong>Risco de liquidez:</strong> acoes de pequenas empresas podem ter baixo volume, dificultando a venda no preco desejado.</Typography>
          </Box>
          <InfoCard icon={<WarningAmberOutlinedIcon />} color="warning.main">
            Nunca invista em acoes com dinheiro que voce pode precisar no curto prazo. O mercado pode ficar em queda por meses ou anos antes de se recuperar.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Por que investir em acoes no longo prazo</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Historicamente, acoes superam a inflacao e a maioria dos outros ativos no <strong>longo prazo</strong> (horizontes de 10 anos ou mais). O crescimento economico das empresas, combinado com o reinvestimento de dividendos, cria um efeito de juros compostos poderoso.
          </Typography>
          <Typography variant="body2" paragraph>
            O Ibovespa, que reune as principais acoes do Brasil, entregou retornos reais positivos na maioria das decadas desde sua criacao, apesar de crises pontuais.
          </Typography>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            O time no mercado (permanecer investido por muitos anos) tende a ser mais importante do que o timing do mercado (tentar prever o melhor momento de entrar e sair).
          </InfoCard>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
