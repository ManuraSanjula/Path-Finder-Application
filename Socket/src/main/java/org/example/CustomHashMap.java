package org.example;

import java.io.*;
import java.util.Arrays;

public class CustomHashMap<K, V> implements Serializable {
    private static final int INITIAL_CAPACITY = 16;
    private static final float LOAD_FACTOR = 0.75f;

    private int size;
    private int capacity;
    private Entry<K, V>[] table;

    public CustomHashMap() {
        this.capacity = INITIAL_CAPACITY;
        this.table = new Entry[capacity];
    }

    private static class Entry<K, V> implements Serializable {
        final K key;
        V value;
        Entry<K, V> next;

        Entry(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }

    public void put(K key, V value) {
        int index = indexFor(hash(key), capacity);
        for (Entry<K, V> entry = table[index]; entry != null; entry = entry.next) {
            if (entry.key.equals(key)) {
                entry.value = value;
                return;
            }
        }
        addEntry(key, value, index);
    }

    public V get(K key) {
        int index = indexFor(hash(key), capacity);
        for (Entry<K, V> entry = table[index]; entry != null; entry = entry.next) {
            if (entry.key.equals(key)) {
                return entry.value;
            }
        }
        return null;
    }

    public void remove(K key) {
        int index = indexFor(hash(key), capacity);
        Entry<K, V> prev = table[index];
        Entry<K, V> entry = prev;

        while (entry != null) {
            Entry<K, V> next = entry.next;
            if (entry.key.equals(key)) {
                size--;
                if (prev == entry) {
                    table[index] = next;
                } else {
                    prev.next = next;
                }
                return;
            }
            prev = entry;
            entry = next;
        }
    }

    private void addEntry(K key, V value, int bucketIndex) {
        Entry<K, V> entry = table[bucketIndex];
        table[bucketIndex] = new Entry<>(key, value);
        table[bucketIndex].next = entry;
        size++;

        if (size >= capacity * LOAD_FACTOR) {
            resize(2 * capacity);
        }
    }

    private void resize(int newCapacity) {
        Entry<K, V>[] oldTable = table;
        capacity = newCapacity;
        table = new Entry[capacity];
        size = 0;

        for (Entry<K, V> entry : oldTable) {
            while (entry != null) {
                put(entry.key, entry.value);
                entry = entry.next;
            }
        }
    }

    private int hash(Object key) {
        return key.hashCode() & (capacity - 1);
    }

    private int indexFor(int hash, int length) {
        return hash & (length - 1);
    }

    public int size() {
        return size;
    }

    public void clear() {
        Arrays.fill(table, null);
        size = 0;
    }
}
