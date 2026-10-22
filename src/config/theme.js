import { createTheme } from '@mui/material/styles';

/**
 * Tokens do InvestLink.
 *
 * O que estava errado antes:
 *   `primary` era azul-marinho e `secondary` era laranja, mas a marca, o logo
 *   e todos os botões de ação usavam o laranja. O resultado era link azul ao
 *   lado de botão laranja na mesma linha, e uma AppBar com gradiente azul
 *   fixo que ignorava a paleta inteira.
 *
 *   Agora o laranja é o `primary` — uma decisão, não um acidente — e a
 *   superfície é neutra. Cor no produto passa a significar alguma coisa.
 *
 * Verde e vermelho **não** são `success` e `error`:
 *   Em tela de investimento eles querem dizer "subiu" e "caiu", não "deu
 *   certo" e "deu errado". Ficam em `market.positive` / `market.negative`,
 *   e `success`/`error` continuam para estado de interface. Misturar os dois
 *   é o que faz um alerta de risco parecer um erro de sistema.
 */

const BRAND = {
  50: '#FFF4ED',
  100: '#FFE6D5',
  200: '#FFC9AA',
  300: '#FDA474',
  400: '#FB7332',
  500: '#F35815',
  600: '#E43F06',
  700: '#BD2D08',
  800: '#96250F',
  900: '#7A2110',
};

// Cinzas levemente quentes: o #121212 do MUI ao lado do laranja da marca puxa
// para o azulado e faz a tela parecer suja.
const NEUTRAL = {
  25: '#FAFAF9',
  50: '#F5F5F4',
  100: '#E7E5E4',
  200: '#D6D3D1',
  300: '#A8A29E',
  400: '#78716C',
  500: '#57534E',
  600: '#44403C',
  700: '#292524',
  800: '#1C1917',
  900: '#141210',
  950: '#0C0A09',
};

const MARKET = {
  positiveDark: '#4ADE80',
  positiveLight: '#15803D',
  negativeDark: '#F87171',
  negativeLight: '#B91C1C',
  neutralDark: '#A8A29E',
  neutralLight: '#78716C',
};

export function createAppTheme(darkMode) {
  const mode = darkMode ? 'dark' : 'light';

  const palette = {
    mode,
    primary: {
      main: darkMode ? BRAND[400] : BRAND[600],
      light: darkMode ? BRAND[300] : BRAND[500],
      dark: darkMode ? BRAND[500] : BRAND[700],
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: darkMode ? NEUTRAL[300] : NEUTRAL[600],
    },
    success: { main: darkMode ? '#4ADE80' : '#15803D' },
    warning: { main: darkMode ? '#FBBF24' : '#B45309' },
    error: { main: darkMode ? '#F87171' : '#B91C1C' },
    info: { main: darkMode ? '#60A5FA' : '#1D4ED8' },
    background: darkMode
      ? { default: NEUTRAL[950], paper: NEUTRAL[900] }
      : { default: NEUTRAL[50], paper: '#FFFFFF' },
    text: darkMode
      ? { primary: '#F5F5F4', secondary: NEUTRAL[300], disabled: NEUTRAL[400] }
      : { primary: NEUTRAL[800], secondary: NEUTRAL[500], disabled: NEUTRAL[300] },
    divider: darkMode ? 'rgba(245,245,244,0.10)' : 'rgba(28,25,23,0.10)',
    // Fora da paleta do MUI de propósito: subir e cair não é acertar e errar.
    market: {
      positive: darkMode ? MARKET.positiveDark : MARKET.positiveLight,
      negative: darkMode ? MARKET.negativeDark : MARKET.negativeLight,
      neutral: darkMode ? MARKET.neutralDark : MARKET.neutralLight,
    },
    brand: BRAND,
    neutral: NEUTRAL,
  };

  const surfaceBorder = `1px solid ${palette.divider}`;

  return createTheme({
    palette,
    typography: {
      fontFamily:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      // Número em tabela precisa de dígito de largura fixa, senão a coluna
      // dança a cada linha e comparar dois valores vira trabalho.
      fontFeatureSettings: '"tnum" 1, "cv11" 1',
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 700, letterSpacing: '-0.02em' },
      h6: { fontWeight: 700, letterSpacing: '-0.01em' },
      subtitle2: { fontWeight: 600 },
      button: { fontWeight: 600 },
      overline: {
        fontWeight: 700,
        fontSize: '0.6875rem',
        letterSpacing: '0.08em',
        lineHeight: 1.6,
      },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontVariantNumeric: 'tabular-nums',
            scrollbarColor: `${palette.text.disabled} transparent`,
          },
          '::-webkit-scrollbar': { width: 10, height: 10 },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: palette.text.disabled,
            borderRadius: 8,
            border: '2px solid transparent',
            backgroundClip: 'content-box',
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'inherit' },
        styleOverrides: {
          root: {
            // Sem gradiente: a barra é moldura, não a estrela da tela.
            backgroundColor: palette.background.paper,
            backgroundImage: 'none',
            borderBottom: surfaceBorder,
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: surfaceBorder,
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { textTransform: 'none', borderRadius: 8 },
          sizeSmall: { paddingInline: 12 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
          sizeSmall: { height: 22, fontSize: '0.75rem' },
          outlined: { borderColor: palette.divider },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            minHeight: 44,
          },
        },
      },
      MuiTooltip: {
        defaultProps: { arrow: true },
        styleOverrides: {
          tooltip: {
            fontSize: '0.75rem',
            lineHeight: 1.5,
            padding: '8px 10px',
            maxWidth: 300,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: palette.divider },
          head: { fontWeight: 700, whiteSpace: 'nowrap' },
        },
      },
      MuiLink: {
        defaultProps: { underline: 'hover' },
      },
      MuiAlert: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: { root: { borderRadius: 10 } },
      },
      MuiDivider: {
        styleOverrides: { root: { borderColor: palette.divider } },
      },
    },
  });
}
