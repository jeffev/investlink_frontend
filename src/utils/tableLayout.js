/**
 * Extrai do estado da tabela apenas as propriedades que devem ser persistidas.
 * Retorna null se não houver nada relevante para salvar.
 */
export function collectTableState(table) {
  const state = table.getState();
  const tableState = {};

  if (Object.keys(state.columnVisibility).length > 0) {
    tableState.columnVisibility = state.columnVisibility;
  }
  if (Object.keys(state.columnOrder).length > 0) {
    tableState.columnOrder = state.columnOrder;
  }
  if (Object.keys(state.columnSizing).length > 0) {
    tableState.columnSizing = state.columnSizing;
  }
  if (state.pagination != null) {
    tableState.pagination = state.pagination;
  }
  if (state.density != null) {
    tableState.density = state.density;
  }

  return Object.keys(tableState).length > 0 ? tableState : null;
}
