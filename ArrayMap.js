/**
 * Maps N-dimensional array (or any iterable as key) to a value
 */
class ArrayMap {
    #root;
    #size;

    constructor() {
        this.#root = new ArrayMapNode(null);
        this.#size = 0;

        // Binding
        this.has = this.has.bind(this);
        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
        this.delete = this.delete.bind(this);
        this.entries = this.entries.bind(this);
    }

    get size() {
        return this.#size;
    }

    has(keys) {
        const node = this.#findNode(keys);
        return node != null && node.value != ArrayMapNode.EMPTY_VALUE;
    }

    get(keys) {
        const node = this.#findNode(keys);
        return (node != null && node.value != ArrayMapNode.EMPTY_VALUE) ? node.value : undefined;
    }

    set(keys, value) {
        const node = this.#findNode(keys, true);  // `node` it is guaranteed to not be null.
        if (node.value == ArrayMapNode.EMPTY_VALUE) this.#size++;
        node.value = value;
    }

    delete(keys) {
        let node = this.#findNode(keys);
        if (node == null) return;

        this.#size--;
        node.value = ArrayMapNode.EMPTY_VALUE;
        while (node.value == ArrayMapNode.EMPTY_VALUE && node.size == 0) {
            if (node.parent == null) break;

            node.parent.delete(node.key);
            node = node.parent;
        }
    }

    *entries() {
        for (const [nestedKeys, value] of this.#yieldNestedKeysAndValues(this.#root)) {
            yield [[...this.#flatNestedKeys(nestedKeys)], value];
        }
    }

    values() {
        return this.#yieldValues(this.#root);
    }

    #findNode(keys, createIfNotExists = false) {
        let node = this.#root;
        for (const key of keys) {
            if (!node.has(key)) {
                if (!createIfNotExists) return null;
                node.set(key, new ArrayMapNode(key, node));
            }
            node = node.get(key);
        }
        return node;
    }

    *#yieldValues(node) {
        if (node.value != ArrayMapNode.EMPTY_VALUE) {
            yield node.value;
        }
        for (const subNode of node.values()) {
            for (const value of this.#yieldValues(subNode)) {
                yield value;
            }
        }
    }

    *#yieldNestedKeysAndValues(node) {
        if (node.value != ArrayMapNode.EMPTY_VALUE) {
            yield [node.key, node.value];
        }
        for (const [key, subNode] of node.entries()) {
            for (const [nestedKeys, value] of this.#yieldNestedKeysAndValues(subNode)) {
                yield [[key, nestedKeys], value];
            }
        }
    }

    *#flatNestedKeys(nestedKeys) {
        while (nestedKeys && nestedKeys[0]) {
            yield nestedKeys[0];
            nestedKeys = nestedKeys[1];
        }
    }
}


/**
 * Internal node of ArrayMap data structure
 */
class ArrayMapNode extends Map {
    static EMPTY_VALUE = Symbol("ArrayMapNode.EmptyValue");

    constructor(key, parent = null) {
        super();
        this.key = key;
        this.parent = parent;
        this.value = ArrayMapNode.EMPTY_VALUE;
    }
}
