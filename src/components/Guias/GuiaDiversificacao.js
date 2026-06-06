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

export default function GuiaDiversificacao() {
  return (
    <Box sx={{ py: 3, maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Diversificacao e Alocacao de Ativos
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Diversificar significa distribuir os investimentos entre diferentes ativos, setores e classes para reduzir o risco sem necessariamente reduzir o retorno esperado.
      </Typography>

      <SectionTitle>Por que diversificar</SectionTitle>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body2" paragraph>
        O risco de uma carteira de investimentos pode ser dividido em dois tipos:
      </Typography>
      <Table size="small" sx={{ mb: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, width: '30%' }}>Tipo de Risco</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>O que e</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Pode ser eliminado?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[
            ['Risco Idiossincratico (Especifico)', 'Risco de um ativo individual: falencia da empresa, fraude, perda de contrato. Afeta so aquele ativo.', 'Sim — pela diversificacao entre ativos.'],
            ['Risco Sistematico (Mercado)', 'Risco que afeta todos os ativos: crise economica, alta de juros, pandemia. Nao ha como fugir investindo so no mercado acionario.', 'Parcialmente — diversificando entre classes de ativos.'],
          ].map(([tipo, desc, elim]) => (
            <TableRow key={tipo} hover>
              <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{tipo}</TableCell>
              <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{desc}</Typography></TableCell>
              <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{elim}</Typography></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
        Estudos mostram que a maior parte do risco idiossincratico e eliminada com uma carteira de 15 a 20 ativos bem diversificados entre setores. Acima disso, o beneficio adicional de diversificacao e marginal.
      </InfoCard>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Diversificacao por setor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Ter acoes de diferentes setores protege a carteira de crises especificas. Se o setor de petroleo sofre com queda do petroleo, os bancos ou o varejo podem continuar se saindo bem.
          </Typography>
          <Typography variant="body2" paragraph>
            Exemplos de setores na B3: Energia Eletrica, Bancos, Petroleo e Gas, Mineracao, Varejo, Saude, Agronegocio, Tecnologia, Construcao Civil, Transportes.
          </Typography>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            Use a aba <strong>Concentracao</strong> da Minha Carteira para visualizar os donuts de concentracao por setor. O InvestLink alerta quando um setor representa mais de 40% da carteira.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Diversificacao por classe de ativo</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Diferentes classes de ativos se comportam de formas distintas em diferentes cenarios economicos:
          </Typography>
          <Table size="small" sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: '25%' }}>Classe</TableCell>
                <TableCell sx={{ fontWeight: 700, width: '35%' }}>Comportamento tipico</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Funcao na carteira</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Acoes', 'Maior volatilidade, maior retorno no longo prazo', 'Crescimento de capital'],
                ['FIIs', 'Renda mensal, correlacao com juros e imoveis', 'Renda passiva e diversificacao imobiliaria'],
                ['Renda Fixa (CDB, Tesouro)', 'Previsibilidade, retorno atrelado ao CDI/SELIC/IPCA', 'Protecao e reserva de oportunidade'],
                ['Ouro / Dolar', 'Protecao em crises e depreciacoes cambiais', 'Hedge contra instabilidade sistemica'],
              ].map(([cls, comp, funcao]) => (
                <TableRow key={cls} hover>
                  <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{cls}</TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{comp}</Typography></TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{funcao}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Como definir a alocacao de ativos</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            A alocacao ideal depende do <strong>perfil de risco</strong>, do <strong>horizonte de investimento</strong> e dos <strong>objetivos financeiros</strong> de cada investidor. Algumas referencias:
          </Typography>
          <Table size="small" sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Perfil</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Acoes</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>FIIs</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Renda Fixa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Conservador', '10–20%', '10–20%', '60–80%'],
                ['Moderado', '30–40%', '20–30%', '30–50%'],
                ['Agressivo', '50–70%', '20–30%', '10–30%'],
              ].map(([perfil, ac, fii, rf]) => (
                <TableRow key={perfil} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{perfil}</TableCell>
                  <TableCell><Typography variant="body2">{ac}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{fii}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{rf}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <InfoCard icon={<WarningAmberOutlinedIcon />} color="warning.main">
            Estas faixas sao apenas referencias educativas. Cada situacao e unica. Considere conversar com um assessor de investimentos certificado antes de definir sua alocacao.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Rebalanceamento — quando e como fazer</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Com o tempo, os ativos crescem em ritmos diferentes, fazendo a alocacao real divergir da alocacao alvo. O rebalanceamento corrige isso.
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Periodicidade:</strong> revise a alocacao a cada 6 a 12 meses, ou quando algum ativo ultrapassar significativamente o alvo (ex: +10 pontos percentuais).
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Por aporte:</strong> em vez de vender o que valorizou, direcione os novos aportes para os ativos abaixo do alvo — mais eficiente tributariamente.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Por venda:</strong> vender o que esta acima do alvo e comprar o que esta abaixo. Gera evento tributavel — considere os custos antes.
            </Typography>
          </Box>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            Use a aba <strong>Rebalanceamento</strong> da Minha Carteira para definir a alocacao alvo com o slider e ver a sugestao de aporte calculada automaticamente.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Riscos de concentracao excessiva</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Uma carteira muito concentrada em um unico ativo, setor ou gestora amplifica o risco especifico desnecessariamente. Alguns cenarios de risco:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              50% em acoes de uma unica empresa: qualquer problema especifico da empresa impacta metade da carteira.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              70% em FIIs de logistica: uma crise no setor de e-commerce ou excesso de oferta de galpoes afeta a maior parte da renda.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              100% do patrimonio em acoes sem reserva de emergencia: em uma crise, a necessidade de liquidez pode forcar venda no pior momento.
            </Typography>
          </Box>
          <InfoCard icon={<WarningAmberOutlinedIcon />} color="warning.main">
            O InvestLink alerta para concentracoes acima de 40% em um unico setor. Nao e uma regra rigida, mas um sinal para reflexao consciente sobre o risco assumido.
          </InfoCard>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
