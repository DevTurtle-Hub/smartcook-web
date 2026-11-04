import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const compile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(compile(source)).toString('base64')}`;
const maps = moduleUrl(readFileSync(new URL('../src/utils/storeMaps.ts', import.meta.url), 'utf8'));
const source = readFileSync(new URL('../src/utils/currentLocation.ts', import.meta.url), 'utf8').replace("from './storeMaps'", `from '${maps}'`);
const { getCurrentLocation } = await import(moduleUrl(source));

let calls = 0;
const position = { coords: { latitude: 16.069, longitude: 108.208, accuracy: 23 } };
const fix = await getCurrentLocation({ getCurrentPosition(success, _error, options) {
  calls++;
  assert.equal(options.enableHighAccuracy, true);
  assert.equal(options.maximumAge, 0, 'Do not use a cached location for the current-address search');
  success(position);
} });
assert.deepEqual(fix, { lat: 16.069, lng: 108.208, accuracy: 23 });
assert.equal(calls, 1);
for (const code of [1, 2, 3]) {
  await assert.rejects(getCurrentLocation({ getCurrentPosition(_success, error) { error({ code }); } }), Error,
    'A denied, unavailable or timed-out position must fail instead of returning a default city');
}
await assert.rejects(getCurrentLocation(undefined));
await assert.rejects(getCurrentLocation({ getCurrentPosition(success) { success({ coords: { latitude: 91, longitude: 108, accuracy: 10 } }); } }));
await assert.rejects(getCurrentLocation({ getCurrentPosition(success) { success({ coords: { ...position.coords, accuracy: 50000 } }); } }), /quá rộng/);
await assert.rejects(getCurrentLocation({ getCurrentPosition(success) { success({ coords: { ...position.coords, accuracy: NaN } }); } }));
console.log('PASS: fresh device coordinates, high accuracy, denied/unavailable/timeout handling, no default-city fallback, rejection of invalid and overly approximate positions.');
