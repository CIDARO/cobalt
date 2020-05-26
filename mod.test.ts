import { LRUCache, LRUEntry } from "./mod.ts";
import { assertEquals } from "https://deno.land/std@v0.50.0/testing/asserts.ts";

const cache = new LRUCache(100);

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
