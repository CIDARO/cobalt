import { Cobalt } from "./mod.ts";
import { assertEquals } from "https://deno.land/std@v0.50.0/testing/asserts.ts";

const cache = new Cobalt(100);

Deno.test("Setting one item.", () => {
    cache.set('test', 'test');
    assertEquals(cache.get('test'), 'test', 'Value set is different.');
})

Deno.test("Retrieving an unexisting key.", () => {
    assertEquals(cache.get('null'), null, 'Item retrieved is not null.');
})

Deno.test("Retrieving size.", () => {
    assertEquals(cache.size, 1, 'Size mismatch.');
})

Deno.test("Inserting 100 items.", () => {
    for (let i = 0; i <= 100; i++) cache.set(`${i}`, `${i}`);
    assertEquals(cache.get('1'), '1', 'Value set is different.');
    assertEquals(cache.get('test'), null, 'Item retrieved is not null.');
})

Deno.test("Retrieving all the keys.", () => {
    const keys = cache.keys();
    assertEquals(keys.length, cache.size, 'Keys length and cache size do not match.');
})

Deno.test("Retrieving all the values.", () => {
    const values = cache.values();
    assertEquals(values.length, cache.size, 'Values length and cache size do not match.');
})

Deno.test("Converting cache to an array.", () => {
    const array = cache.toArray();
    assertEquals(array.length, cache.size, 'Array length and cache size do not match.');
})

Deno.test("Converting cache to a reversed array.", () => {
    const array = cache.toArrayReverse();
    assertEquals(array.length, cache.size, 'Reversed array length and cache size do not match.');
})