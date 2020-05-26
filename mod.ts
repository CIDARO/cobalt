/**
 * CobaltEntry class defines all the objects that are available 
 * in the double linked list and in the cache.
 */
export class CobaltEntry {
    // CobaltEntry key
    key: String;
    // CobaltEntry value
    value: String;
    // Next CobaltEntry in the list
    next: CobaltEntry | null;
    // Prev CobaltEntry in the list
    prev: CobaltEntry | null;

    /**
     * Constructor method for a new CobaltEntry
     * 
     * @param key entry key
     * @param value entry value
     * @param next next entry in the list
     * @param prev previous entry in the list
     */
    constructor(key: String, value: String, next?: CobaltEntry, prev?: CobaltEntry) {
        this.key = key;
        this.value = value;
        this.next = next || null;
        this.prev = prev || null;
    }
}

/**
 * Cobalt defines our least recently used cache.
 */
export class Cobalt {
    // Cobalt capacity (default is 1000)
    capacity: number;
    // Cobalt map
    cache: Map<String, CobaltEntry>;
    // Cobalt head (most recently used item)
    head: CobaltEntry | null;
    // Cobalt tail (least recently used item)
    tail: CobaltEntry | null;

    /**
     * Constructor method for a new Cobalt
     * 
     * @param capacity cache capacity
     */
    constructor(capacity?: number) {
        this.capacity = capacity || 1000;
        this.cache = new Map<String, CobaltEntry>();
        this.head = null;
        this.tail = null;
    }

    /**
     * @returns cache size
     */
    get size() {
        return this.cache.size;
    }

    /**
     * Sets a new key/value pair in the LRU cache.
     * Creates a new CobaltEntry that becomes the new head of the list.
     * 
     * @param key new entry key
     * @param value new entry value
     */
    set(key: String, value: String) {
        // Check if the Cobalt has still space available
        if (this.size >= this.capacity && this.tail) this.remove(this.tail.key);
        // Initialize the new entry variable
        let newEntry;
        // Create the new entry
        if (!this.head) {
            newEntry = new CobaltEntry(key, value);
            // Set it as the new head and tail
            this.head = this.tail = newEntry;
        } else {
            newEntry = new CobaltEntry(key, value, this.head);
            // Change the current head prev link
            this.head.prev = newEntry;
            // Set the new entry as the head
            this.head = newEntry;
        }
        // Set the key/entry pair in the cache
        this.cache.set(key, newEntry);
    }

    /**
     * Sets a new key/value pair in the LRU cache using
     * an existing CobaltEntry object.
     * 
     * @param entry entry to set
     */
    _setEntry(entry: CobaltEntry) {
        this.set(entry.key, entry.value);
    }

    /**
     * Retrieves the value associated to a key.
     * Also, it removes and sets again the key/value pair so
     * it is marked as a most recently used.
     * 
     * @param key key used to retrieved a value
     * @returns the value associated to the input key or null
     */
    get(key: String): String | null {
        // Retrieve the entry
        const entry = this.cache.get(key);
        // If it does not exist return null
        if (!entry) return null;
        // Remove the key
        this.remove(key);
        // Set again the key/value pair
        this.set(key, entry.value);
        // Return the value
        return entry.value;
    }

    /**
     * Checks if the input key is present in the cache.
     * 
     * @param key key used for the check
     * @returns true/false if the key is present in the cache or not
     */
    has(key: String): boolean {
        return this.cache.has(key);
    }

    /**
     * Deletes the tail and returns its value if it exists.
     * 
     * @returns the value of the tail or null
     */
    pop() {
        // If no tail is present just return null
        if (!this.tail) return null;
        // Get the value
        const tailValue = this.tail.value;
        // Remove the tail
        this.remove(this.tail.key);
        // Return the tail value
        return tailValue;
    }

    /**
     * Removes the entry with the input key.
     * Updates the head and tail objects too.
     * 
     * @param key key used to remove the item
     */
    remove(key: String) {
        // Get the node with the given key
        const currentNode = this.cache.get(key);
        // Return if it does not exist
        if (!currentNode) return;
        // Check if the node has a previous node
        if (currentNode.prev) {
            // Fix the list
            currentNode.prev.next = currentNode.next;
        } else {
            // If it has no previous node it must be the head
            // So we update the head
            this.head = currentNode.next;
        }
        // Check if the node has a next node
        if (currentNode.next) {
            // Fix the list
            currentNode.next.prev = currentNode.prev;
        } else {
            // If it has no next node it must be the tail
            // So we update the tail
            this.tail = currentNode.prev;
        }
        // Remove the key from the map
        this.cache.delete(key);
    }

    /**
     * Resets the Cobalt object.
     * Sets the head and tail to null and creates an empty
     * map for the cache property.
     */
    reset() {
        this.cache = new Map<String, CobaltEntry>();
        this.head = null;
        this.tail = null;
    }

    /**
     * Returns an array with all the keys in the cache.
     * 
     * @returns all the keys in the cache
     */
    keys(): String[] {
        const keys: String[] = [];
        this.forEach((entry: CobaltEntry) => {
            keys.push(entry.key);
        })
        return keys;
    }

    /**
     * Returns an array with all the values in the cache.
     * 
     * @returns all the values in the cache
     */
    values(): any[] {
        const values: any[] = [];
        this.forEach((entry: CobaltEntry) => {
            values.push(entry.value);
        })
        return values;
    }
    
    /**
     * Iterates through all the nodes in the Cobalt.
     * Takes a function as an input that can consume
     * the (currentNode, index) tuple like any array.
     * 
     * @param fn function called on (currentNode, index)
     */
    forEach(fn: Function) {
        // Get the head as the current node
        let currentNode = this.head;
        // Set the index as 0
        let index = 0;
        // Iterate until there's a currentNode as next
        while (currentNode) {
            // Call the function given as an input
            fn.call(currentNode, index);
            // Update the current node with the next
            currentNode = currentNode.next;
            // Increase the index
            index++;
        }
    }

    /**
     * Iterates through all the nodes in the Cobalt in reverse order.
     * Takes a function as an input that can consume
     * the (currentNode, index) tuple like any array.
     * 
     * @param fn function called on (currentNode, index)
     */
    forEachReverse(fn: Function) {
        // Get the head as the current node
        let currentNode = this.tail;
        // Set the index as the cache size - 1
        let index = this.size - 1;
        // Iterate until there's a currentNode as previous
        while (currentNode) {
            // Call the function given as an input
            fn.call(currentNode, index);
            // Update the current node with the previous
            currentNode = currentNode.prev;
            // Decrease the index
            index--;
        }
    }

    /**
     * Converts the CobaltCache into an Array of entries
     * 
     * @returns an array with all the Cobalt entries
     */
    toArray(): Array<CobaltEntry> {
        const array = new Array(this.size);
        this.forEach((entry: CobaltEntry, index: number) => array[index] = entry);
        return array;
    }

    /**
     * Converts the CobaltCache into a reversed Array of entries
     * 
     * @returns an array with all the Cobalt entries in reverse order
     */
    toArrayReverse(): Array<CobaltEntry> {
        const array = new Array(this.size);
        this.forEachReverse((entry: CobaltEntry, index: number) => array[index] = entry);
        return array;
    }

    /**
     * Iterator used for a for..of method.
     */
    *[Symbol.iterator]() {
        let node = this.head;
        while (node) {
          yield node;
          node = node.next;
        }
      }
}