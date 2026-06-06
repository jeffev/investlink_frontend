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

const INDICADORES_COMPARADOR = [
  { ind: 'Preco', desc: 'Cotacao atual do ativo.' },
  { ind: 'P/L', desc: 'Preco / Lucro — menor e melhor para valuation.' },
  { ind: 'P/VP', desc: 'Preco / Valor Patrimonial — abaixo de 1 indica possivel subavaliacao.' },
  { ind: 'EV/EBITDA', desc: 'Enterprise Value / EBITDA — menor tende a ser mais barato.' },
  { ind: 'EV/EBIT', desc: 'Enterprise Value / EBIT — considera estrutura de capital.' },
  { ind: 'P/EBIT', desc: 'Preco / EBIT — alternativa ao P/L para comparacoes setoriais.' },
  { ind: 'DY', desc: 'Dividend Yield — maior indica mais retorno em dividendos.' },
  { ind: 'ROE', desc: 'Retorno sobre Patrimonio — maior indica mais eficiencia.' },
  { ind: 'ROA', desc: 'Retorno sobre Ativos — maior indica mais eficiencia no uso de ativos.' },
  { ind: 'ROIC', desc: 'Retorno sobre Capital Investido — maior e melhor.' },
  { ind: 'Margem EBIT', desc: 'Margem operacional — maior indica modelo de negocio mais rentavel.' },
  { ind: 'Margem Liquida', desc: 'Margem final — quanto da receita vira lucro.' },
  { ind: 'CAGR Receitas', desc: 'Crescimento anual composto de receitas em 5 anos — maior e melhor.' },
  { ind: 'Score ML', desc: 'Pontuacao composta (0–100) de fundamentos.' },
];

export default function GuiaComparador() {
  return (
    <Box sx={{ py: 3, maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Como usar o Comparador de Ativos
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        O Comparador permite selecionar multiplas acoes e visualizar seus indicadores lado a lado, com destaque para o melhor valor em cada metrica e um grafico de performance historica normalizada.
      </Typography>

      <SectionTitle>Como selecionar ativos para comparar</SectionTitle>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body2" paragraph>
        No topo da pagina de Comparar ha um campo de autocomplete. Digite o ticker ou nome da empresa e selecione o ativo desejado. Repita o processo para adicionar mais ativos.
      </Typography>
      <Typography variant="body2" paragraph>
        O autocomplete busca entre todas as acoes disponíveis no banco de dados. Voce pode comparar ativos de setores diferentes, mas faz mais sentido comparar empresas do mesmo setor para contextualizacao de multiplos.
      </Typography>
      <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
        Adicione pelo menos dois ativos para que a tabela e o grafico sejam exibidos. A tabela destaca em verde o melhor valor de cada indicador entre os ativos selecionados.
      </InfoCard>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Os 14 indicadores da tabela comparativa</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            A tabela exibe os seguintes indicadores para cada ativo selecionado. O valor destacado em verde indica o melhor resultado naquele indicador entre os ativos comparados:
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: '25%' }}>Indicador</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>O que representa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {INDICADORES_COMPARADOR.map((row) => (
                <TableRow key={row.ind} hover>
                  <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{row.ind}</TableCell>
                  <TableCell><Typography variant="body2">{row.desc}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Grafico de preco normalizado base 100</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Abaixo da tabela comparativa, o grafico de linhas exibe a performance historica de preco de todos os ativos selecionados em uma base comum de 100.
          </Typography>
          <Typography variant="body2" paragraph>
            O valor 100 representa o preco do ativo no inicio do periodo selecionado. Se apos 6 meses um ativo esta em 130, ele valorizou 30% no periodo. Isso permite comparar a performance relativa de ativos com precos absolutos muito diferentes (ex: WEGE3 a R$ 35 vs ITUB4 a R$ 35).
          </Typography>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            O grafico normalizado responde a pergunta: "se eu tivesse investido o mesmo valor em cada um desses ativos ao mesmo tempo, qual teria rendido mais?". E uma comparacao justa independente do preco absoluto.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Quando usar o Comparador vs o detalhe individual</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Use o <strong>Comparador</strong> quando:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Voce ja tem 2–3 candidatos e quer escolher o melhor com base em multiplos</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Quiser comparar ON vs PN de uma mesma empresa (ex: PETR3 vs PETR4)</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Quiser ver qual das maiores empresas de um setor teve melhor performance historica</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Estiver avaliando trocar uma posicao por outra dentro do mesmo setor</Typography>
          </Box>
          <Typography variant="body2" paragraph>
            Use a <strong>pagina de detalhe</strong> quando:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 1 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Quiser aprofundar a analise de um unico ativo com grafico de candlestick</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Precisar ver o Preco Teto calculado pelas formulas de Bazin e Gordon</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Quiser ver as probabilidades detalhadas do modelo ML</Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
