package org.example;

import java.io.Serial;
import java.io.Serializable;

public class UserCred implements Serializable {
    @Serial
    private static final long serialVersionUID = 134567903311L;

    public String email;
    public String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
