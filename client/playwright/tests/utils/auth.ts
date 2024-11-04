import { Page } from "@playwright/test";

const generateEmail = (domain: string): string => {
    const id = Math.random().toString(36).substring(2, 12);
    return id + "@" + domain;
}

const generatePassword = (length: number): string => {
    const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const array = new Uint32Array(alphabet.length);
    crypto.getRandomValues(array);
    let password = "";
    for (let i = 0; i < length; i++) {
        password += alphabet[array[i] % alphabet.length];
    }
    return password;
}

const authenticate = async (page: Page) => {
    await page.request.post(
        "/api/users/login",
        {
            data: {
                email: process.env.TEST_EMAIL,
                password: process.env.TEST_PASSWORD
            }
        });
    await page.goto("/");
}

const logout = async (page: Page) => {
    await page.request.post("/api/users/logout");
    await page.goto("/");
}

type OAuth = {
    type: string,
    url: string | RegExp
};

const OAuthMethods: OAuth[] = [
    {
        type: "Google",
        url: /accounts.google.com/
    },
    {
        type: "GitHub",
        url: /github.com/
    }
];

export {
    generateEmail,
    generatePassword,
    authenticate,
    logout,
    OAuthMethods
};