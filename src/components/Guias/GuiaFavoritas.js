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

export default function GuiaFavoritas() {
  return (
    <Box sx={{ py: 3, maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Como usar as Favoritas
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        As Favoritas permitem acompanhar de perto um conjunto de acoes e FIIs selecionados, configurar alertas de preco e personalizar quais colunas exibir. Ha duas paginas separadas: uma para acoes e outra para FIIs.
      </Typography>

      <SectionTitle>Como adicionar as favoritas</SectionTitle>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body2" paragraph>
        Ha duas formas de favoritar um ativo:
      </Typography>
      <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
        <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
          <strong>A partir da lista:</strong> clique no icone de estrela na linha do ativo desejado na Lista de Acoes ou Lista de FIIs. O icone ficara preenchido ao ser ativado.
        </Typography>
        <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
          <strong>A partir do detalhe:</strong> na pagina de detalhe de uma acao (acessada clicando no ticker), ha um botao de favoritar no topo da pagina.
        </Typography>
      </Box>
      <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
        Os favoritos ficam associados a sua conta. Ao acessar o InvestLink de outro dispositivo, sua lista de favoritos estara disponivel apos o login.
      </InfoCard>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Alertas de preco</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Para cada acao favoritada, voce pode configurar um <strong>preco alvo</strong>. Quando o preco atual ficar abaixo do alvo configurado, a acao sera destacada na lista de favoritas e o icone de notificacao na barra superior exibira um contador com o numero de alertas ativos.
          </Typography>
          <Typography variant="body2" paragraph>
            Para configurar um alerta, clique no icone de edicao (lapide) na linha da acao favoritada e informe o preco alvo desejado no campo correspondente.
          </Typography>
          <InfoCard icon={<TipsAndUpdatesOutlinedIcon />} color="info.main">
            O icone de sino com contador vermelho na barra superior indica quantos alertas de preco estao ativos. Clique nele para ir direto para a pagina de Favoritas.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Layouts salvos de colunas</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            A tabela de Favoritas (tanto de acoes quanto de FIIs) permite personalizar quais colunas sao exibidas. Oculte colunas que voce nao usa e deixe apenas os indicadores relevantes para sua estrategia.
          </Typography>
          <Typography variant="body2" paragraph>
            O layout de colunas e salvo automaticamente por tipo de ativo: as colunas exibidas nas acoes favoritas sao independentes das colunas dos FIIs favoritos. Isso permite configuracoes diferentes para cada tipo.
          </Typography>
          <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
            O layout de colunas e salvo na sua conta (nao apenas no navegador), entao estara disponivel em qualquer dispositivo onde voce fizer login.
          </InfoCard>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Como remover das favoritas</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Para remover um ativo das favoritas, ha duas opcoes:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0, mb: 1 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Na pagina de Favoritas:</strong> clique no icone de lixeira (vermelho) na linha do ativo que deseja remover.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              <strong>Na lista de acoes/FIIs:</strong> clique novamente na estrela ja preenchida da acao/FII — o icone voltara ao estado vazio e o ativo sera removido das favoritas.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
