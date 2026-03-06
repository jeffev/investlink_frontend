import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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

const SCORE_DIMENSIONS = [
  { label: 'Qualidade', peso: 35, color: '#1565c0', desc: 'ROE, ROIC, ROA, margens operacional e líquida — mede o quanto a empresa gera de retorno sobre seus recursos.' },
  { label: 'Valor', peso: 30, color: '#2e7d32', desc: 'P/L, P/VP, EV/EBIT, desconto em relação à fórmula de Graham — avalia o quão barata a ação está em relação aos seus fundamentos.' },
  { label: 'Crescimento', peso: 20, color: '#e65100', desc: 'CAGR de receitas 5 anos, crescimento de lucro — mede a capacidade de expansão da empresa.' },
  { label: 'Dividendos', peso: 15, color: '#6a1b9a', desc: 'Dividend Yield — avalia o retorno direto ao acionista via proventos.' },
];

const LABEL_ROWS = [
  {
    label: 'BARATA',
    color: 'success',
    criterio: 'Retorno histórico > Ibovespa em +15% ou mais (alpha > +15%)',
    interpretacao: 'O modelo identificou padrão de fundamentos similares a ações que superaram o índice com folga. Possível oportunidade de compra segundo os dados históricos.',
  },
  {
    label: 'NEUTRA',
    color: 'primary',
    criterio: 'Retorno histórico entre -15% e +15% em relação ao Ibovespa',
    interpretacao: 'A ação tende a acompanhar o mercado. Nem claramente subavaliada nem sobreavaliada pelos fundamentos analisados.',
  },
  {
    label: 'CARA',
    color: 'error',
    criterio: 'Retorno histórico < Ibovespa em -15% ou mais (alpha < -15%)',
    interpretacao: 'O modelo identificou padrão de fundamentos associado a ações que ficaram significativamente abaixo do índice. Cautela recomendada.',
  },
];

export default function ExplicacaoML() {
  return (
    <Box sx={{ py: 3, maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Como funciona a Análise por Inteligência Artificial
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
        O InvestLink utiliza um modelo de machine learning treinado com dados históricos de indicadores fundamentalistas para classificar ações e calcular um score composto. Esta página explica em detalhes como a análise é gerada e como interpretá-la.
      </Typography>

      <InfoCard icon={<WarningAmberOutlinedIcon />} color="warning.main">
        Esta análise é informativa e baseada em padrões históricos. Não constitui recomendação de investimento. Rentabilidade passada não garante retornos futuros.
      </InfoCard>

      {/* COMO O MODELO FOI TREINADO */}
      <SectionTitle>Como o modelo foi treinado</SectionTitle>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" paragraph>
        O modelo usa dados históricos de indicadores fundamentalistas de ações do Ibovespa, coletados pelo pipeline de scraping do InvestLink. Para cada ação em cada período histórico, o sistema calcula o <strong>alpha</strong> — a diferença entre o retorno da ação e o retorno do Ibovespa no mesmo período.
      </Typography>

      <Typography variant="body2" paragraph>
        Com base no alpha, cada observação histórica recebe um <strong>rótulo (label)</strong>:
      </Typography>

      <Box sx={{ pl: 2, mb: 2 }}>
        <Typography variant="body2">• <strong>BARATA</strong> → alpha {'>'} +15%</Typography>
        <Typography variant="body2">• <strong>CARA</strong> → alpha {'<'} -15%</Typography>
        <Typography variant="body2">• <strong>NEUTRA</strong> → entre -15% e +15%</Typography>
      </Box>

      <Typography variant="body2" paragraph>
        O modelo então aprende a associar os indicadores fundamentalistas (P/L, ROIC, margens, endividamento etc.) aos rótulos históricos. Dois algoritmos são treinados e comparados — <strong>GradientBoosting</strong> e <strong>XGBoost</strong> — usando validação cruzada estratificada com 5 folds (StratifiedKFold) e busca de hiperparâmetros (GridSearchCV). O melhor modelo é selecionado automaticamente.
      </Typography>

      <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
        Pesos balanceados (compute_sample_weight 'balanced') são aplicados durante o treino para compensar o desequilíbrio natural entre classes — na prática, há menos ações extremamente baratas ou caras do que ações neutras.
      </InfoCard>

      {/* COMO INTERPRETAR A CLASSIFICAÇÃO */}
      <SectionTitle>Como interpretar a classificação (BARATA / NEUTRA / CARA)</SectionTitle>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" sx={{ mb: 2 }}>
        Ao abrir a lista de ações, cada linha pode exibir um chip colorido na coluna <strong>Análise ML</strong>. Passe o mouse sobre o chip para ver as probabilidades individuais de cada classe.
      </Typography>

      <Table size="small" sx={{ mb: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, width: '15%' }}>Label</TableCell>
            <TableCell sx={{ fontWeight: 700, width: '40%' }}>Critério de origem</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Como interpretar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {LABEL_ROWS.map((row) => (
            <TableRow key={row.label} hover>
              <TableCell sx={{ verticalAlign: 'top', pt: 1.5 }}>
                <Chip label={row.label} color={row.color} size="small" />
              </TableCell>
              <TableCell sx={{ verticalAlign: 'top' }}>
                <Typography variant="body2">{row.criterio}</Typography>
              </TableCell>
              <TableCell sx={{ verticalAlign: 'top' }}>
                <Typography variant="body2">{row.interpretacao}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>Probabilidades no tooltip:</strong> ao passar o mouse sobre o chip, você verá algo como <em>Barata: 62% | Neutra: 28% | Cara: 10%</em>. Uma probabilidade alta na classe vencedora indica maior confiança do modelo naquela classificação. Probabilidades próximas a 33% em todas as classes indicam incerteza — trate essas ações com mais cautela.
      </Typography>

      {/* SCORE COMPOSTO */}
      <SectionTitle>Score composto (0–100)</SectionTitle>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" paragraph>
        O <strong>Score</strong> é uma pontuação de 0 a 100 calculada pelo pipeline de feature engineering, independente do modelo de ML. Ele combina quatro dimensões dos fundamentos da empresa:
      </Typography>

      {SCORE_DIMENSIONS.map((d) => (
        <Box key={d.label} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" fontWeight={600}>
              {d.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {d.peso}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={d.peso}
            sx={{
              height: 8,
              borderRadius: 4,
              mb: 0.5,
              backgroundColor: 'action.hover',
              '& .MuiLinearProgress-bar': { backgroundColor: d.color },
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {d.desc}
          </Typography>
        </Box>
      ))}

      <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
        Cada indicador dentro de uma dimensão é normalizado com z-scores setoriais (comparando a empresa com outras do mesmo setor) e depois combinado na proporção acima. O resultado final é rescalonado para o intervalo 0–100.
      </Typography>

      <InfoCard icon={<InfoOutlinedIcon />} color="info.main">
        Score alto significa bons fundamentos relativos ao setor. Um score alto <em>não garante</em> que a ação está barata — uma empresa excelente pode estar sendo negociada a múltiplos elevados. Use o Score em conjunto com a Análise ML e os indicadores individuais.
      </InfoCard>

      {/* LIMITAÇÕES */}
      <SectionTitle>Limitações importantes</SectionTitle>
      <Divider sx={{ mb: 2 }} />

      <Box component="ul" sx={{ pl: 2, mt: 0 }}>
        <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
          O modelo é treinado com dados históricos — padrões que funcionaram no passado podem não se repetir no futuro.
        </Typography>
        <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
          Eventos macroeconômicos, mudanças de gestão, escândalos ou rupturas setoriais não são capturados pelos indicadores fundamentalistas.
        </Typography>
        <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
          Ações com dados incompletos ou muito voláteis podem receber classificações menos confiáveis. Probabilidades equilibradas (próximas de 33% cada) indicam incerteza.
        </Typography>
        <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
          O modelo é retreinado periodicamente — a classificação de uma ação pode mudar à medida que seus fundamentos evoluem.
        </Typography>
        <Typography component="li" variant="body2">
          Esta ferramenta é uma <strong>tela quantitativa</strong> — deve ser o ponto de partida de uma análise, não a decisão final.
        </Typography>
      </Box>
    </Box>
  );
}
