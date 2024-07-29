package org.example;

import java.io.*;
import javax.crypto.SecretKey;
import java.util.Base64;

public class CustomDatabase<K, V> {
    private CustomHashMap<K, V> hashMap;
    private File file;
    private SecretKey secretKey;

    public CustomDatabase(String filePath, SecretKey secretKey) {
        this.file = new File(filePath);
        this.secretKey = secretKey;
        this.hashMap = new CustomHashMap<>();
        load();
    }

    public void put(K key, V value) {
        hashMap.put(key, value);
        save();
    }

    public V get(K key) {
        return hashMap.get(key);
    }

    public void remove(K key) {
        hashMap.remove(key);
        save();
    }

    public void save() {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(file))) {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ObjectOutputStream tempOos = new ObjectOutputStream(baos);
            tempOos.writeObject(hashMap);
            tempOos.close();

            byte[] serializedData = baos.toByteArray();
            String base64Data = Base64.getEncoder().encodeToString(serializedData);
            String encryptedData = EncryptionUtil.encrypt(base64Data, secretKey);
            oos.writeObject(encryptedData);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void load() {
        if (file.exists()) {
            try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file))) {
                String encryptedData = (String) ois.readObject();
                String base64Data = EncryptionUtil.decrypt(encryptedData, secretKey);

                byte[] serializedData = Base64.getDecoder().decode(base64Data);
                ByteArrayInputStream bais = new ByteArrayInputStream(serializedData);
                ObjectInputStream tempOis = new ObjectInputStream(bais);
                hashMap = (CustomHashMap<K, V>) tempOis.readObject();
                tempOis.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
