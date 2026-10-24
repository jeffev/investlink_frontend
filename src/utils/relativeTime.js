/**
 * "há 2 horas", "ontem", "há 3 dias".
 *
 * A vitrine precisa dizer de quando é o preço que está mostrando. Lista de
 * oportunidade sem data é lista em que não dá para confiar: ninguém sabe se é
 * o fechamento de ontem ou o de três semanas atrás — e por meses a
 * atualização dependia de alguém lembrar de clicar num botão.
 */
export function relativeTime(isoDate, now = new Date()) {
  if (!isoDate) return null;

  const date = new Date(isoDate.endsWith('Z') ? isoDate : `${isoDate}Z`);
  if (Number.isNaN(date.getTime())) return null;

  const seconds = Math.round((now - date) / 1000);
  if (seconds < 90) return 'agora há pouco';

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours} h`;

  const days = Math.round(hours / 24);
  if (days === 1) return 'ontem';
  if (days < 30) return `há ${days} dias`;

  const months = Math.round(days / 30);
  return months === 1 ? 'há 1 mês' : `há ${months} meses`;
}
