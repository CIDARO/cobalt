/**
 * CobaltOptions interface defines how a Cobalt cache
 * must be initialized.
 */
export interface CobaltOptions {
    capacity?: number; // Cobalt cache capacity
    allowStale?: boolean; // If the Cobalt cache allows staleness or not
    maxAge?: number; // Max age in seconds for each entry
}

/**
 * CobaltEntryOptions interface defines the new CobaltEntry
 * options, including key, value, next entry, previous entry
 * and the maxAge value.
 */
export interface CobaltEntryOptions {
    key: String; // entry key
    value: String; // entry value
    next?: CobaltEntry; // next entry
    prev?: CobaltEntry; // previous entry
    maxAge?: number; // max age in seconds
}

/**
 * CobaltEntry class defines all the objects that are available 
 * in the double linked list and in the cache.
 * 
 * @property {String} key CobaltEntry key
 * @property {String} value CobaltEntry value
 * @property {CobaltEntry | null} next Next entry in the list
 * @property {CobaltEntry | null} prev Previous entry in the list
 * @property {number} date When the entry has been created (timestamp)
 * @property {number} maxAge How long the entry will live (in seconds)
 */
export class CobaltEntry {
    key: String;
    value: String;
    next: CobaltEntry | null;
    prev: CobaltEntry | null;
    date: number;
    maxAge: number = 0;

    /**
     * Constructor method for a new CobaltEntry
     * 
     * @param options new CobaltEntry options object
     */
    constructor(options: CobaltEntryOptions) {
        this.key = options.key;
        this.value = options.value;
        this.next = options.next || null;
        this.prev = options.prev || null;
        this.date = Date.now();
        this.maxAge = options.maxAge || 0;
    }

    /**
     * Returns true if the entry is stale, false otherwise.
     * 
     * @returns true if the entry is stale, false otherwise
     */
    get stale() {
        if (!this.maxAge) return false;
        return Date.now() - this.date > this.maxAge;
    }
}

/**
 * Cobalt defines our least recently used cache.
 * 
 * @property {number} capacity Cobalt cache capacity (default is 1000)
 * @property {Map<String, CobaltEntry>} cache Cobalt map String->CobaltEntry
 * @property {CobaltEntry | null} head Cobalt head (MRU - Most Recently Used item)
 * @property {CobaltEntry | null} tail Cobalt tail (LRU - Least Recently Used item)
 * @property {boolean} allowStale If the Cobalt cache allows staleness or not
 * @property {number} maxAge Max age that an entry can live in seconds if allowStale is true
 */
export class Cobalt {
    capacity: number;
    cache: Map<String, CobaltEntry>;
    head: CobaltEntry | null;
    tail: CobaltEntry | null;
    allowStale: boolean;
    maxAge: number = 0;

    /**
     * Constructor method for a new Cobalt
     * 
     * @param options new Cobalt cache options
     */
    constructor(options?: CobaltOptions) {
        this.capacity = options?.capacity || 1000;
        this.cache = new Map<String, CobaltEntry>();
        this.head = null;
        this.tail = null;
        this.allowStale = options?.allowStale || false;
        if (this.allowStale) this.maxAge = options?.maxAge || 0;
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
            newEntry = new CobaltEntry({key, value, maxAge: this.maxAge});
            // Set it as the new head and tail
            this.head = this.tail = newEntry;
        } else {
            newEntry = new CobaltEntry({key, value, next: this.head, maxAge: this.maxAge});
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
        if (entry.stale) {
            return null;
        }
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
        const { value, stale } = this.tail;
        // Remove the tail
        this.remove(this.tail.key);
        // Return the tail value
        return stale ? null : value;
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
        this.forEach((entry: CobaltEntry, index: number) => {
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
        this.forEach((entry: CobaltEntry, index: number) => {
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
            fn(currentNode, index);
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
            fn(currentNode, index);
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