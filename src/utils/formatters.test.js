import {
  EMPTY,
  formatBRL,
  formatNumber,
  formatPercent,
  formatValue,
} from './formatters';

describe('formatters', () => {
  it('formata moeda em pt-BR', () => {
    expect(formatBRL(1234.5)).toContain('1.234,50');
    expect(formatBRL(1234.5)).toContain('R$');
  });

  it('usa vírgula como separador decimal, não ponto', () => {
    // Antes da extração metade das telas mostrava 8.20 e a outra metade 8,20.
    expect(formatNumber(8.2)).toBe('8,20');
    expect(formatPercent(34.92)).toBe('34,92%');
  });

  it('respeita o número de casas pedido', () => {
    expect(formatNumber(8.2, { digits: 0 })).toBe('8');
    expect(formatPercent(8.25, { digits: 1 })).toBe('8,3%');
  });

  describe('valor ausente', () => {
    it('mostra travessão, nunca zero', () => {
      // Um indicador que a empresa não reporta não pode parecer zero.
      expect(formatBRL(null)).toBe(EMPTY);
      expect(formatNumber(undefined)).toBe(EMPTY);
      expect(formatPercent(null)).toBe(EMPTY);
      expect(formatValue(null, 'currency')).toBe(EMPTY);
    });

    it('permite trocar o texto de ausente', () => {
      expect(formatBRL(null, { fallback: 'sem dado' })).toBe('sem dado');
    });

    it('não confunde zero com ausente', () => {
      expect(formatNumber(0)).toBe('0,00');
      expect(formatPercent(0)).toBe('0,00%');
    });
  });

  describe('formatValue', () => {
    it('despacha pelo nome do formato', () => {
      expect(formatValue(1234.5, 'currency')).toContain('1.234,50');
      expect(formatValue(8.2, 'percent')).toBe('8,20%');
      expect(formatValue(8.2, 'number')).toBe('8,20');
    });

    it('devolve o valor cru quando o formato é desconhecido', () => {
      expect(formatValue('CVM', 'texto')).toBe('CVM');
    });
  });
});
