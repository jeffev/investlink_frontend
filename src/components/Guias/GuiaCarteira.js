import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

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

export default function GuiaCarteira() {
  return (
    <Box sx={{ py: 3, maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Como usar a Minha Carteira
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        A pagina Minha Carteira permite registrar suas posicoes em acoes e FIIs, acompanhar o desempenho, planejar o rebalanceamento e monitorar a concentracao setorial. Ela e organizada em 5 abas.
      </Typography>

      <SectionTitle>Aba Acoes — registrar posicoes</SectionTitle>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body2" paragraph>
        Na aba <strong>Acoes</strong>, registre cada posicao informando o ticker, a quantidade de acoes e o preco medio de compra. A carteira calcula automaticamente:
      </Typography>
      <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
        <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Valor total investido (quantidade x preco medio)</Typography>
        <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Valor atual (quantidade x preco atual coletado pelo pipeline)</Typography>
        <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>PnL (lucro/prejuizo nao realizado) em reais e percentual</Typography>
      </Box>
      <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
        Os precos atuais sao coletados pelo pipeline de dados e podem nao refletir a cotacao em tempo real. Para precos em tempo real, consulte seu home broker.
      </InfoCard>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Aba FIIs — posicoes de fundos imobiliarios</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Funciona de forma identica a aba de Acoes, com um campo adicional: <strong>Renda Mensal</strong>, que estima o rendimento mensal da posicao com base no ultimo DY mensal do fundo multiplicado pelo valor total investido.
          </Typography>
          <Typography variant="body2" paragraph>
            O total de renda mensal de todos os FIIs e exibido no card de Renda Mensal Estimada no topo da aba, permitindo visualizar rapidamente o quanto sua carteira de FIIs gera de renda passiva.
          </Typography>
          <InfoCard icon={<WarningAmberOutlinedIcon />} color="warning.main">
            A renda mensal estimada e baseada no ultimo rendimento distribuido e pode variar. FIIs nao garantem rendimentos constantes.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Aba Rebalanceamento</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            O rebalanceamento ajuda a manter a proporcao desejada entre acoes e FIIs na sua carteira. Funciona assim:
          </Typography>
          <Box component="ol" sx={{ pl: 2, mt: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Use o <strong>slider</strong> para definir sua alocacao alvo (ex: 70% Acoes / 30% FIIs)</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>O sistema compara com a alocacao atual calculada a partir das posicoes registradas</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>Informe o valor do proximo aporte e o sistema sugere como dividir entre acoes e FIIs para aproximar a carteira do alvo</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>A tabela de setores mostra a concentracao atual por setor das acoes</Typography>
          </Box>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            A alocacao alvo fica salva no navegador (localStorage). Se voce limpar os dados do navegador, precisara redefinir o slider.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Aba Concentracao</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Exibe dois graficos de donut: um para a concentracao por <strong>setor das acoes</strong> e outro por <strong>segmento dos FIIs</strong>. Cada fatia representa a proporcao do valor total alocado naquele setor/segmento.
          </Typography>
          <Typography variant="body2" paragraph>
            Quando um setor ou segmento representa mais de <strong>40%</strong> do total, um alerta visual e exibido. Alta concentracao em um unico setor aumenta o risco especifico — uma crise setorial pode impactar desproporcionalmente a carteira.
          </Typography>
          <InfoCard icon={<WarningAmberOutlinedIcon />} color="warning.main">
            Concentracao acima de 40% em um setor nao e necessariamente ruim para investidores que conhecem bem aquele setor, mas e um sinal para revisao consciente da estrategia.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Aba Historico — registrar transacoes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Registre cada operacao de COMPRA ou VENDA informando o ticker, tipo de ativo (Acao ou FII), tipo de operacao, quantidade, preco por acao/cota e data da operacao.
          </Typography>
          <Typography variant="body2" paragraph>
            O historico calcula automaticamente:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}><strong>Total Compras:</strong> soma de todas as operacoes de COMPRA</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}><strong>Total Vendas:</strong> soma de todas as operacoes de VENDA</Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}><strong>Resultado Realizado:</strong> Total Vendas - Total Compras (lucro ou prejuizo efetivamente realizado)</Typography>
          </Box>
          <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
            O historico de transacoes nao e vinculado automaticamente as posicoes registradas nas abas de Acoes e FIIs. Voce pode usar o historico separadamente para controle fiscal sem afetar as posicoes exibidas na carteira.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Dicas de uso pratico</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box component="ul" sx={{ pl: 2, mt: 0 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
              Mantenha as posicoes atualizadas ao comprar mais acoes ou FIIs para que o PnL e o rebalanceamento reflitam a realidade.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
              Use a aba Concentracao periodicamente — o crescimento diferente de cada ativo ao longo do tempo pode mudar a alocacao real de forma significativa.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
              O BenchmarkBar abaixo dos cards de resumo mostra CDI e IPCA dos ultimos 12 meses para contextualizacao da rentabilidade da carteira.
            </Typography>
            <Typography component="li" variant="body2">
              Use o Historico de transacoes para calcular o resultado realizado no ano e auxiliar no preenchimento do IR.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
