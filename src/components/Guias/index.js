import GuiaListaAcoes from './GuiaListaAcoes';
import GuiaListaFiis from './GuiaListaFiis';
import GuiaCarteira from './GuiaCarteira';
import GuiaFavoritas from './GuiaFavoritas';
import GuiaComparador from './GuiaComparador';
import GuiaIA from './GuiaIA';
import GuiaGlossarioAcoes from './GuiaGlossarioAcoes';
import GuiaGlossarioFiis from './GuiaGlossarioFiis';
import GuiaOQueSaoAcoes from './GuiaOQueSaoAcoes';
import GuiaAnaliseFundamentalista from './GuiaAnaliseFundamentalista';
import GuiaValuation from './GuiaValuation';
import GuiaRentabilidade from './GuiaRentabilidade';
import GuiaDividendos from './GuiaDividendos';
import GuiaOQueSaoFiis from './GuiaOQueSaoFiis';
import GuiaDiversificacao from './GuiaDiversificacao';
import GuiaIR from './GuiaIR';

const GUIAS_MAP = {
  'como-usar-acoes': { title: 'Como usar a Lista de Acoes', component: GuiaListaAcoes },
  'como-usar-fiis': { title: 'Como usar a Lista de FIIs', component: GuiaListaFiis },
  'como-usar-carteira': { title: 'Como usar a Minha Carteira', component: GuiaCarteira },
  'como-usar-favoritas': { title: 'Como usar as Favoritas', component: GuiaFavoritas },
  'como-usar-comparador': { title: 'Como usar o Comparador de Ativos', component: GuiaComparador },
  'como-usar-ia': { title: 'Como funciona a Analise por IA', component: GuiaIA },
  'glossario-acoes': { title: 'Glossario de Acoes', component: GuiaGlossarioAcoes },
  'glossario-fiis': { title: 'Glossario de FIIs', component: GuiaGlossarioFiis },
  'o-que-sao-acoes': { title: 'O que sao Acoes', component: GuiaOQueSaoAcoes },
  'analise-fundamentalista': { title: 'Analise Fundamentalista', component: GuiaAnaliseFundamentalista },
  'valuation': { title: 'Valuation', component: GuiaValuation },
  'rentabilidade': { title: 'Rentabilidade', component: GuiaRentabilidade },
  'dividendos': { title: 'Dividendos', component: GuiaDividendos },
  'o-que-sao-fiis': { title: 'Fundos Imobiliarios (FIIs)', component: GuiaOQueSaoFiis },
  'diversificacao': { title: 'Diversificacao e Alocacao', component: GuiaDiversificacao },
  'ir-investimentos': { title: 'Imposto de Renda em Investimentos', component: GuiaIR },
};

export default GUIAS_MAP;
