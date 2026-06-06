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

const TIPOS_FII = [
  { tipo: 'Tijolo', desc: 'Investe diretamente em imoveis fisicos (galpoes, escritorios, shoppings). Receita vem de alugueis. Mais exposto a vacancia e ciclo imobiliario.' },
  { tipo: 'Papel', desc: 'Investe em titulos de renda fixa imobiliaria: CRI (Certificado de Recebiveis Imobiliarios) e LCI (Letra de Credito Imobiliario). Menor volatilidade, mas sensivel a taxa de juros.' },
  { tipo: 'Hibrido', desc: 'Combina investimentos em imoveis fisicos e titulos de papel. Diversificacao entre os dois tipos dentro do mesmo fundo.' },
  { tipo: 'FOF (Fund of Funds)', desc: 'Investe em cotas de outros FIIs. Oferece diversificacao automatica, mas adiciona uma camada extra de taxas (taxa do FOF + taxas dos fundos investidos).' },
];

const INDICADORES_FII = [
  { ind: 'DY Mensal', desc: 'Ultimo rendimento distribuido dividido pelo preco atual da cota. Referencia para o fluxo de caixa imediato.' },
  { ind: 'DY 12M', desc: 'Soma dos ultimos 12 rendimentos dividida pelo preco atual. Melhor indicador de longo prazo, mas pode incluir distribuicoes extraordinarias.' },
  { ind: 'P/VP', desc: 'Preco da cota / Valor Patrimonial por Cota. Abaixo de 1: mercado paga menos que o valor dos ativos do fundo. Acima de 1: mercado paga premio.' },
  { ind: 'Vacancia', desc: 'Percentual da area locavel desocupada. Alta vacancia reduz receita de alugueis e pode pressionar os rendimentos distribuidos.' },
];

export default function GuiaOQueSaoFiis() {
  return (
    <Box sx={{ py: 3, maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Fundos de Investimento Imobiliario (FIIs)
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        FIIs permitem que investidores pessoas fisicas acessem o mercado imobiliario com poucos reais, recebendo rendimentos mensais isentos de IR.
      </Typography>

      <SectionTitle>O que e um FII</SectionTitle>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body2" paragraph>
        Um Fundo de Investimento Imobiliario (FII) e um <strong>condominio de investidores</strong> que aplicam recursos coletivos em ativos imobiliarios. As cotas do fundo sao negociadas na B3 como acoes (sufixo 11 — ex: KNRI11, HGLG11).
      </Typography>
      <Typography variant="body2" paragraph>
        O fundo e gerido por um gestor profissional, que decide quais imoveis comprar, locar ou vender (no caso de fundos de tijolo) ou quais titulos adquirir (no caso de fundos de papel). Os cotistas nao tem controle sobre as decisoes do fundo.
      </Typography>
      <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
        A lei obriga os FIIs a distribuir pelo menos <strong>95% dos resultados</strong> semestrais aos cotistas. Na pratica, a maioria distribui mensalmente. Isso torna os FIIs uma fonte de renda passiva mais previsivel que acoes.
      </InfoCard>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Tipos de FIIs: Tijolo, Papel, Hibrido e FOF</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small" sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: '20%' }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Caracteristica</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {TIPOS_FII.map((row) => (
                <TableRow key={row.tipo} hover>
                  <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{row.tipo}</TableCell>
                  <TableCell><Typography variant="body2">{row.desc}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            Em periodos de alta de juros, fundos de Papel tendem a se beneficiar (CRIs indexados ao CDI sobem). Em periodos de juro baixo, fundos de Tijolo com contratos de aluguel indexados ao IPCA tendem a ter melhor desempenho.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Segmentos dos FIIs de Tijolo</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small" sx={{ mb: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: '28%' }}>Segmento</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Caracteristicas e riscos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Lajes Corporativas', 'Escritorios em grandes centros urbanos. Ciclico com a economia. Mais afetado por home office e trabalho hibrido.'],
                ['Logistica', 'Galpoes e centros de distribuicao. Beneficiado pelo e-commerce. Contratos longos e indexados.'],
                ['Shoppings', 'Receita atrelada ao fluxo de visitantes e ao consumo das familias. Recuperou-se bem apos a pandemia.'],
                ['Residencial', 'Apartamentos para aluguel. Segmento em crescimento no Brasil, com alta demanda em grandes cidades.'],
                ['Agro', 'Terras agricolas com contratos de arrendamento. Rendimentos em reais, indexados ao valor da terra e ao agronegocio.'],
              ].map(([seg, desc]) => (
                <TableRow key={seg} hover>
                  <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{seg}</TableCell>
                  <TableCell><Typography variant="body2">{desc}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Indicadores especificos de FIIs</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small" sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: '22%' }}>Indicador</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>O que representa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {INDICADORES_FII.map((row) => (
                <TableRow key={row.ind} hover>
                  <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{row.ind}</TableCell>
                  <TableCell><Typography variant="body2">{row.desc}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
            P/VP abaixo de 1 em FIIs de tijolo pode ser uma oportunidade — voce esta comprando imoveis por menos do que valem no papel. Mas verifique se ha problemas estruturais no fundo (alta vacancia, contratos vencendo, gestao ruim) que justifiquem o desconto.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Tributacao dos FIIs</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
              <strong>Rendimentos mensais:</strong> isentos de IR para pessoa fisica, desde que o fundo tenha mais de 50 cotistas e o investidor nao possua mais de 10% das cotas.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
              <strong>Ganho de capital na venda de cotas:</strong> tributado a 20% sobre o lucro, sem a isencao de R$ 20.000/mes que existe para acoes.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
              <strong>DARF:</strong> deve ser pago ate o ultimo dia util do mes seguinte ao da venda com lucro.
            </Typography>
          </Box>
          <InfoCard icon={<WarningAmberOutlinedIcon />} color="warning.main">
            A legislacao tributaria pode ser alterada. Consulte as regras vigentes no momento do investimento e, se necessario, um contador especializado em investimentos.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Diferencas entre FIIs e Acoes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small" sx={{ mb: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: '30%' }}>Aspecto</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Acoes</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>FIIs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Distribuicao obrigatoria', 'Ao menos 25% do lucro ajustado', 'Ao menos 95% do resultado semestral'],
                ['Frequencia de rendimentos', 'Variavel (tri/semi/anual)', 'Mensal (pratica padrao)'],
                ['Potencial de crescimento', 'Alto (reinvestimento de lucros)', 'Limitado (distribui quase tudo)'],
                ['Tributacao dividendos PF', 'Atualmente isento', 'Isento (com condicoes)'],
                ['Ganho de capital', '15% (isento ate R$20k/mes)', '20% (sem isencao)'],
                ['Gestao', 'Conselho e diretoria da empresa', 'Gestor profissional contratado'],
              ].map(([asp, ac, fii]) => (
                <TableRow key={asp} hover>
                  <TableCell sx={{ fontWeight: 500, verticalAlign: 'top' }}>{asp}</TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{ac}</Typography></TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}><Typography variant="body2">{fii}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
