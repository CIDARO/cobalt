<div align="center">
  <br/>
  <img src="./cobalt.png" width="200" />
  <br/>
  <br/>
  <p>
    Open Source LRU Cache for Deno.
  </p>
  <p>
    version 1.0.0
  </p>
  <p>
    <a href="https://deno.land/x/cobalt/mod.ts">
      <img src="https://doc.deno.land/badge.svg" />
    </a>
    <a href="#">
      <img src="https://github.com/CIDARO/cobalt/workflows/test/badge.svg" />
    </a>
    <a href="https://github.com/CIDARO/cobalt/issues">
      <img src="https://img.shields.io/github/issues/CIDARO/cobalt" />
    </a>
    <a href="https://github.com/CIDARO/cobalt/network">
      <img src="https://img.shields.io/github/forks/CIDARO/cobalt" />
    </a>
    <a href="https://github.com/CIDARO/cobalt/stargazers">
      <img src="https://img.shields.io/github/stars/CIDARO/cobalt" />
    </a>
    <a href="https://github.com/CIDARO/cobalt/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/CIDARO/cobalt" />
    </a>
  </p>
  <br/>
  <p>
    <a href="#status"><strong>Status</strong></a> ·
    <a href="#description"><strong>Description</strong></a> ·
    <a href="#TODOlist"><strong>TODO List</strong></a> ·
    <a href="#usage"><strong>Usage</strong></a> ·
    <a href="#contributing"><strong>Contributing</strong></a>
  </p>
</div>

---

## Status

**Cobalt** is currently in **1.0.0**.

---

## Description

**Cobalt** is an Open Source LRU Cache for Deno.

---

## TODO List

- [x] Basic LRUEntry
- [x] Basic LRUCache (get, set methods)
- [x] forEach, forEachReverse methods
- [x] has, pop, reset methods
- [x] toArray, toArrayReverse methods
- [x] keys, values methods
- [x] entries staleness management
- [ ] peek, load methods
- [ ] support different key/value types (or at least support serialization natively)

---

## Usage

### Import Cobalt object

In order to import Cobalt in your Deno code you must import it at the top:

```typescript
import { Cobalt } from "https://deno.land/x/cobalt/mod.ts";
```

### Create new Cobalt object

After you've imported Cobalt, initialize it with the following code:

```typescript
const cobalt = new Cobalt(); // With default 1000 capacity
const cobaltExpanded = new Cobalt(10000); // Override the default capacity
const cobaltStale = new Cobalt(10000, true, 10); // Creates a new cobalt cache that allows staleness with objects lasting max 10 seconds
```

### Set, get and remove a key/value pair

With an instantiated Cobalt object you can **set**, **get** and **remove** a key/value pair:

```typescript
cobalt.set('key', 'test'); // Sets the value 'test' for the key 'test'

cobalt.get('key'); // Returns 'test'

cobalt.remove('key'); // Removes the key from the cache

cobalt.get('key'); // Returns null
```

### Useful functions and properties

These are some of the functions that you can use with a Cobalt object:

```typescript
cobalt.size; // returns the cache size

cobalt.reset(); // resets the cache to its starting configuration

cobalt.keys(); // returns an array with all the keys in the cache

cobalt.values(); // returns an array with all the values in the cache

cobalt.has('key'); // returns true if the cache has the 'key' key, false otherwise

cobalt.pop(); // removes the last entry (tail) and returns its value

cobalt.forEach((entry, index) => /* do something */); // iterates through the cache from the MRU to the LRU

cobalt.forEachReverse((entry, index) => /* do something */); // iterates through the cache from the LRU to the MRU

cobalt.toArray(); // returns the cache as an array of entries

cobalt.toArrayReverse(); // returns the cache as a reversed array of entries
```

### Run tests

In order to run the tests, just clone the directory:

```bash
git clone https://github.com/CIDARO/cobalt.git
```

And then run the following code:

```bash
cd cobalt
deno test mod.test.ts
```

Hopefully everything will be ok!

---

## Contributing

We welcome community contributions!

Please check out our <a href="https://github.com/CIDARO/cobalt/issues">open issues</a> to get started.

If you discover something that could potentially impact security, please notify us immediately by sending an e-mail at <a href="mailto:support@cidaro.com">support@cidaro.com</a>. We'll get in touch with you as fast as we can!
