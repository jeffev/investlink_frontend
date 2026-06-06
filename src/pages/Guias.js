import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Typography,
} from '@mui/material';
import {
  TrendingUpOutlined,
  ApartmentOutlined,
  AccountBalanceWalletOutlined,
  StarOutlined,
  CompareArrowsOutlined,
  PsychologyOutlined,
  StorefrontOutlined,
  AnalyticsOutlined,
  CalculateOutlined,
  ShowChartOutlined,
  PaidOutlined,
  PieChartOutlined,
  ReceiptLongOutlined,
  MenuBookOutlined,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const GUIAS_APP = [
  {
    slug: 'como-usar-acoes',
    icon: <TrendingUpOutlined />,
    title: 'Lista de Acoes',
    desc: 'Filtros, colunas, chip ML e como favoritar',
  },
  {
    slug: 'como-usar-fiis',
    icon: <ApartmentOutlined />,
    title: 'Lista de FIIs',
    desc: 'DY, P/VP, vacancia, segmentos e filtros',
  },
  {
    slug: 'como-usar-carteira',
    icon: <AccountBalanceWalletOutlined />,
    title: 'Minha Carteira',
    desc: 'Posicoes, rebalanceamento e historico',
  },
  {
    slug: 'como-usar-favoritas',
    icon: <StarOutlined />,
    title: 'Favoritas e Alertas',
    desc: 'Alertas de preco e layouts de colunas',
  },
  {
    slug: 'como-usar-comparador',
    icon: <CompareArrowsOutlined />,
    title: 'Comparar Ativos',
    desc: '14 indicadores lado a lado e grafico normalizado',
  },
  {
    slug: 'como-usar-ia',
    icon: <PsychologyOutlined />,
    title: 'Analise por IA',
    desc: 'Como o modelo ML classifica as acoes',
  },
];

const GUIAS_EDUCATIVOS = [
  {
    slug: 'o-que-sao-acoes',
    icon: <StorefrontOutlined />,
    title: 'O que sao Acoes',
    desc: 'Estrutura, tipos e como a acao gera valor',
  },
  {
    slug: 'analise-fundamentalista',
    icon: <AnalyticsOutlined />,
    title: 'Analise Fundamentalista',
    desc: 'Os 4 pilares: valor, qualidade, crescimento e dividendos',
  },
  {
    slug: 'valuation',
    icon: <CalculateOutlined />,
    title: 'Valuation',
    desc: 'P/L, P/VP, EV/EBIT, Graham e multiplos de mercado',
  },
  {
    slug: 'rentabilidade',
    icon: <ShowChartOutlined />,
    title: 'Rentabilidade',
    desc: 'ROE, ROA, ROIC e margens — o que cada um mede',
  },
  {
    slug: 'dividendos',
    icon: <PaidOutlined />,
    title: 'Dividendos',
    desc: 'DY, payout, JCP e dividend trap',
  },
  {
    slug: 'o-que-sao-fiis',
    icon: <ApartmentOutlined />,
    title: 'Fundos Imobiliarios (FIIs)',
    desc: 'Tipos, segmentos, indicadores e tributacao',
  },
  {
    slug: 'diversificacao',
    icon: <PieChartOutlined />,
    title: 'Diversificacao e Alocacao',
    desc: 'Por que diversificar e como rebalancear',
  },
  {
    slug: 'ir-investimentos',
    icon: <ReceiptLongOutlined />,
    title: 'Imposto de Renda',
    desc: 'Tributacao de acoes, FIIs, DARF e declaracao',
  },
];

function GuiaCard({ slug, icon, title, desc }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardActionArea component={Link} to={`/guias/${slug}`} sx={{ height: '100%', p: 0.5 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{ color: 'primary.main' }}>{icon}</Box>
            <Typography variant="subtitle2" fontWeight={700}>
              {title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {desc}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function CardGrid({ cards }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
        gap: 2,
        mb: 4,
      }}
    >
      {cards.map((card) => (
        <GuiaCard key={card.slug} {...card} />
      ))}
    </Box>
  );
}

export default function Guias() {
  return (
    <Box sx={{ py: 3, maxWidth: 960, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <MenuBookOutlined sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight={700}>
          Guias
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Aprenda a usar o InvestLink e aprofunde seus conhecimentos sobre investimentos.
      </Typography>

      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Como usar o InvestLink
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <CardGrid cards={GUIAS_APP} />

      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Aprender a investir
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <CardGrid cards={GUIAS_EDUCATIVOS} />

      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Referencia Rapida
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          component={Link}
          to="/guias/glossario-acoes"
          variant="outlined"
          startIcon={<TrendingUpOutlined />}
        >
          Glossario de Acoes
        </Button>
        <Button
          component={Link}
          to="/guias/glossario-fiis"
          variant="outlined"
          startIcon={<ApartmentOutlined />}
        >
          Glossario de FIIs
        </Button>
      </Box>
    </Box>
  );
}
