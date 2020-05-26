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

**Cobalt** is currently in **1.0.0 version**. It has never been released and currently it's only an idea that we're developing. Please, please, please, **do not** use this in production unless you think it's useful for you!

---

## Description

**Cobalt** is an Open Source LRU Cache for Deno.

---

## TODO List

- [x] Basic LRUEntry
- [x] Basic LRUCache (get, set methods)
- [x] forEach, reverseForEach methods
- [x] has, pop, reset methods
- [ ] peek, load, keys, values methods
- [ ] stale entries management
- [ ] support different key/value types (or at least support serialization natively)

---

## Usage

### Import Cobalt object

In order to import Cobalt in your Deno code you must import it at the top:

```typescript
import { Cobalt } from "https://github.com/CIDARO/cobalt/blob/master/mod.ts";
```

### Create new Cobalt object

After you've imported Cobalt, initialize it with the following code:

```typescript
const cobalt = new Cobalt(); // With default 1000 capacity
const cobaltExpanded = new Cobalt(10000); // Override the default capacity
```

### Set, get and remove a key/value pair

With an instantiated Cobalt object you can **set**, **get** and **remove** a key/value pair:

```typescript
cobalt.set('key', 'test'); // Sets the value 'test' for the key 'test'
cobalt.get('key'); // Returns 'test'
cobalt.remove('key'); // Removes the key from the cache
cobalt.get('key'); // Returns null
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
