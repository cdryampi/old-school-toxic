import test from 'node:test';
import assert from 'node:assert/strict';
import { FALLBACK_MEMBERS, getMemberRoster, parsePublicMembers } from '../src/data/members.mjs';

const page = (rows, guild = 'Lista de miembros Alianza OLD_SCHOOL [TOXIC]') => `<!doctype html><html><body><h1>${guild}</h1><table><tr><th>Jugador</th><th>Rango</th><th>Nivel</th></tr>${rows}</table></body></html>`;
const row = (name, rank) => `<tr><td><a href="?mod=player&amp;p=12">${name}</a></td><td>${rank}</td><td>99</td></tr>`;

test('extrae solo nombres y rangos, y señala los rangos vacíos', () => {
  assert.deepEqual(parsePublicMembers(page(row('Lia', 'Maestro') + row('Saul:)', ''))), [
    ['Lia', 'Maestro'], ['Saul:)', 'No indicado'],
  ]);
});

test('rechaza otras alianzas, resultados vacíos y filas duplicadas', () => {
  assert.throws(() => parsePublicMembers(page(row('Lia', 'Admin'), 'Otra alianza')));
  assert.throws(() => parsePublicMembers(page('')));
  assert.throws(() => parsePublicMembers(page(row('Lia', 'Admin') + row('lia', 'Admin'))));
});

test('usa el respaldo cuando falla la red o responde otra página', async () => {
  const fetchImpl = async () => { throw new Error('sin conexión'); };
  const offline = await getMemberRoster({ fetchImpl });
  assert.equal(offline.source, 'fallback');
  assert.deepEqual(offline.members, FALLBACK_MEMBERS);
  const wrongPage = await getMemberRoster({ fetchImpl: async () => ({ ok: true, text: async () => '<html>Acceso</html>' }) });
  assert.equal(wrongPage.source, 'fallback');
  assert.equal(wrongPage.checkedAt, null);
});

test('consulta pública devuelve datos con fecha sin necesitar cookies', async () => {
  const fetchImpl = async (url, options) => {
    assert.equal(new URL(url).hostname, 's64-es.gladiatus.gameforge.com');
    assert.equal(options.headers.Cookie, undefined);
    assert.equal(options.redirect, 'error');
    return { ok: true, text: async () => page(row('Lia', 'Maestro')) };
  };
  const result = await getMemberRoster({ fetchImpl });
  assert.equal(result.source, 'public');
  assert.ok(result.checkedAt instanceof Date);
  assert.deepEqual(result.members, [['Lia', 'Maestro']]);
});
