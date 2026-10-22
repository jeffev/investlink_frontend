import { asList, totalOf } from './apiShapes';

describe('asList', () => {
  it('deixa passar o array puro', () => {
    const lista = [{ id: 1 }];
    expect(asList(lista)).toBe(lista);
  });

  it('extrai a lista da resposta paginada', () => {
    // É o formato real da API de favoritas. Três páginas chamavam `.find`
    // direto no objeto e quebravam a tela inteira.
    const resposta = { data: [{ id: 1 }], pagination: { total: 1 } };
    expect(asList(resposta)).toEqual([{ id: 1 }]);
  });

  it('devolve lista vazia para o que não é lista', () => {
    // Melhor uma lista vazia do que derrubar a página: o favorito é um
    // detalhe da tela de detalhe, não a razão de ela existir.
    expect(asList(null)).toEqual([]);
    expect(asList(undefined)).toEqual([]);
    expect(asList({ message: 'erro' })).toEqual([]);
  });
});

describe('totalOf', () => {
  it('usa o total da paginação quando existe', () => {
    const resposta = { data: [{ id: 1 }], pagination: { total: 97 } };
    expect(totalOf(resposta, asList(resposta))).toBe(97);
  });

  it('cai para o tamanho da lista sem paginação', () => {
    expect(totalOf([{ id: 1 }, { id: 2 }], [{ id: 1 }, { id: 2 }])).toBe(2);
  });
});
