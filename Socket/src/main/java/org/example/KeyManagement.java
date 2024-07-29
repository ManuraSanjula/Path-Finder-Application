package org.example;

import javax.crypto.SecretKey;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileInputStream;

public class KeyManagement {

    public static void saveKey(SecretKey key, String filePath) throws Exception {
        byte[] keyBytes = key.getEncoded();
        try (FileOutputStream fos = new FileOutputStream(new File(filePath))) {
            fos.write(keyBytes);
        }
    }

    public static SecretKey loadKey(String filePath) throws Exception {
        File file = new File(filePath);
        byte[] keyBytes = new byte[(int) file.length()];
        try (FileInputStream fis = new FileInputStream(file)) {
            fis.read(keyBytes);
        }
        return EncryptionUtil.getKeyFromBytes(keyBytes);
    }
}
