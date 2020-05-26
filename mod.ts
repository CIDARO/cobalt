export class LRUEntry {
    key: String;
    value: String;
    next: LRUEntry | null;
    prev: LRUEntry | null;

    constructor(key: String, value: String, next?: LRUEntry, prev?: LRUEntry) {
        this.key = key;
        this.value = value;
        this.next = next || null;
        this.prev = prev || null;
    }
}

export class LRUCache {
    capacity: number;
    cache: Map<String, LRUEntry>;
    head: LRUEntry | null;
    tail: LRUEntry | null;

    constructor(capacity?: number) {
        this.capacity = capacity || 1000;
        this.cache = new Map<String, LRUEntry>();
        this.head = null;
        this.tail = null;
    }

    get size() {
        return this.cache.size;
    }

    set(key: String, value: String) {
        try {
            if (this.size >= this.capacity && this.tail) this.remove(this.tail.key);

            let newEntry;
    
            if (!this.head) {
                newEntry = new LRUEntry(key, value);
                this.head = this.tail = newEntry;
            } else {
                newEntry = new LRUEntry(key, value, this.head);
                this.head.prev = newEntry;
                this.head = newEntry;
            }
    
            this.cache.set(key, newEntry);
        } catch (error) {
            console.error(error)
        }
    }

    get(key: String): String | any {
        const entry = this.cache.get(key);
        if (!entry) return null;
        this.remove(key);
        this.set(key, entry.value);
        return entry.value;
    }

    has(key: String): boolean {
        return this.cache.has(key);
    }

    pop() {
        if (!this.tail) return null;
        const tailValue = this.tail.value;
        this.remove(this.tail.key);
        return tailValue;
    }

    remove(key: String) {
        const currentNode = this.cache.get(key);

        if (!currentNode) return;

        if (currentNode.prev) {
            currentNode.prev.next = currentNode.next;
        } else {
            this.head = currentNode.next;
        }

        if (currentNode.next) {
            currentNode.next.prev = currentNode.prev;
        } else {
            this.tail = currentNode.prev;
        }

        this.cache.delete(key);
    }

    reset() {
        this.cache = new Map<String, LRUEntry>();
        this.head = null;
        this.tail = null;
    }
    
    forEach(fn: Function) {
        let currentNode = this.head;
        let index = 0;
        while (currentNode) {
            fn(currentNode, index);
            currentNode = currentNode.next;
            index++;
        }
    }

    reverseForEach(fn: Function) {
        let currentNode = this.tail;
        let index = this.size - 1;
        while (currentNode) {
            fn(currentNode, index);
            currentNode = currentNode.prev;
            index--;
        }
    }

    toString(): string {
        let result = "{";
        this.forEach((node: LRUEntry, index: number) => {
            result += `"${node.key}": "${node.value}"`
            if (index < this.size -1) result += ","
        })
        result += "}";
        return result;
    }

    *[Symbol.iterator]() {
        let node = this.head;
        while (node) {
          yield node;
          node = node.next;
        }
      }
}