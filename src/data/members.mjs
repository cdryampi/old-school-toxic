import { load } from 'cheerio';

// Datos facilitados por la alianza el 31/10/2026. Lista parcial.
export const FALLBACK_MEMBERS = Object.freeze([
  ['Princesa_Lia', 'Maestro'], ['Axel', 'Admin'], ['Hollow', 'Admin'],
  ['CassiusFerox', 'Admin'], ['ARQUISTOTELES', 'Admin'], ['theraptor', 'Admin'],
  ['Saul:)', 'Admin'], ['Kletius', 'Admin'], ['Spartaco', 'Admin'],
  ['HuginNRR', 'Admin'], ['HarryPotter', 'Admin'],
]);

const MEMBER_LIST_URL = 'https://s64-es.gladiatus.gameforge.com/game/index.php?mod=guild&submod=memberList&i=1';
const GUILD_NAME = 'Lista de miembros Alianza OLD_SCHOOL [TOXIC]';

/** Solo extrae nombres y rangos de la tabla pública de la alianza esperada. */
export function parsePublicMembers(html) {
  const $ = load(html);
  const text = (value) => value.replace(/\s+/g, ' ').trim();
  if (!$('body').text().includes(GUILD_NAME)) throw new Error('La página no identifica la alianza esperada');
  const matching = $('table').toArray().filter((table) => {
    const cells = $(table).find('tr').first().children('th, td').toArray();
    return cells.length >= 2 && text($(cells[0]).text()) === 'Jugador' && text($(cells[1]).text()) === 'Rango';
  });
  if (matching.length !== 1) throw new Error('No hay una tabla de miembros reconocible');
  const rows = $(matching[0]).find('tr').toArray().slice(1);
  const members = [];
  const seen = new Set();
  for (const row of rows) {
    const cells = $(row).children('td, th');
    if (cells.length < 2) continue;
    const links = cells.eq(0).find('a[href*="mod=player"]');
    const name = text(links.text());
    const rank = text(cells.eq(1).text()) || 'No indicado';
    if (links.length !== 1 || !name || name.length > 80 || !rank || rank.length > 80 || seen.has(name.toLocaleLowerCase('es'))) {
      throw new Error('La tabla contiene filas inválidas o duplicadas');
    }
    seen.add(name.toLocaleLowerCase('es'));
    members.push([name, rank]);
  }
  if (members.length === 0 || members.length > 200) throw new Error('Número de miembros inesperado');
  return members;
}

/** La consulta se hace en el servidor al generar la página, nunca con sesiones. */
export async function getMemberRoster({ fetchImpl = fetch, timeoutMs = 6000 } = {}) {
  try {
    const response = await fetchImpl(MEMBER_LIST_URL, {
      headers: { Accept: 'text/html' },
      redirect: 'error',
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) throw new Error(`Respuesta HTTP ${response.status}`);
    const html = await response.text();
    if (html.length > 2_000_000) throw new Error('Respuesta demasiado grande');
    return { members: parsePublicMembers(html), source: 'public', checkedAt: new Date() };
  } catch (error) {
    console.warn('[miembros] No se pudo consultar la lista pública; usando respaldo:', error instanceof Error ? error.message : 'error desconocido');
    return { members: FALLBACK_MEMBERS, source: 'fallback', checkedAt: null };
  }
}
