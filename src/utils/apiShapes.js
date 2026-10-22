/**
 * Normaliza respostas de lista da API.
 *
 * Os endpoints de lista passaram a devolver `{ data, pagination }`, mas três
 * páginas continuaram tratando a resposta como array puro — e `.find` num
 * objeto derrubava a tela inteira: `/home` abria em branco e `/acao/:ticker`
 * e `/fii/:ticker` mostravam "não encontrada ou erro ao carregar dados" para
 * **todo** ativo, que é o destino de cada card da vitrine.
 *
 * Os testes E2E não pegaram porque o mock devolvia array puro — um contrato
 * que o backend não tem.
 */
export function asList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

export function totalOf(response, fallbackList) {
  return response?.pagination?.total ?? fallbackList.length;
}
