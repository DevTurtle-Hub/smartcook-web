import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Exercise the real API adapter with a controlled transport, without a browser or server.
let response;
let failure;
let request;
globalThis.__scanTestClient = {
  post: async (...args) => {
    request = args;
    if (failure) throw failure;
    return { data: { data: response } };
  },
};
try {
  const source = readFileSync(new URL('../src/api/ai.api.ts', import.meta.url), 'utf8')
    .replace("import { apiClient } from './client';", 'const apiClient = globalThis.__scanTestClient;');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  });
  const { aiApi } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
  const photo = new File(['camera-photo'], 'camera.jpg', { type: 'image/jpeg' });
  failure = Object.assign(new Error('AI unavailable'), { response: { status: 503 } });
  await assert.rejects(aiApi.scanIngredients(photo), error => error === failure,
    'Provider failure must reach the UI, never return sample ingredients');
  failure = undefined;
  response = { accuracy: 0, ingredients: [{ name: 'Rau chưa rõ loại', confidence: '0%', source: 'visible' }], dishes: [] };
  const result = await aiApi.scanIngredients(photo);
  assert.equal(result.accuracy, 0);
  assert.equal(result.ingredients[0].name, 'Rau chưa rõ loại');
  assert.deepEqual(result.dishes, []);
  assert.equal(result.suggestedRecipe, undefined, 'Do not invent a recipe');
  assert.equal(request[1].get('image').name, 'camera.jpg');
  assert.equal(await request[1].get('image').text(), 'camera-photo');
  assert.ok(request[2].timeout > 15000, 'Vision must not inherit the short general API timeout');
  response = { ingredients: [], accuracy: 0 };
  await assert.rejects(aiApi.scanIngredients(photo));
  response = { ingredients: [{ name: 'Unknown' }] };
  await assert.rejects(aiApi.scanIngredients(photo));
  console.log('PASS: scan errors propagate, actual photo is uploaded, zero confidence is preserved, no sample ingredients or recipes, invalid results rejected.');
} finally {
  delete globalThis.__scanTestClient;
}
