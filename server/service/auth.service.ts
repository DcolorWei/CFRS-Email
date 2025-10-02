import { LoginToken, RegisterResult } from "../../shared/router/AuthRouter";
import { AccountEntity } from "../../shared/types/Account";
import { aesDecrypt, aesEncrypt, hashGenerate } from "../lib/crypto";
import Repository from "../lib/respository";

const accountRepository = Repository.instance(AccountEntity);

export async function loginUser(email: string, password: string): Promise<LoginToken> {
    password = hashGenerate(password);
    const emailItem = accountRepository.findOne({ email, password });
    if (emailItem) {
        return { token: gentoken(email), success: true };
    } else {
        return { token: "", success: false };
    }
}

export async function registerUser(email: string, password: string): Promise<RegisterResult> {
    const emailItem = accountRepository.findOne({ email });
    if (emailItem) {
        return { success: false };
    }
    password = hashGenerate(password);
    accountRepository.insert({ email, password });
    return { success: true };
}

registerUser("plumend@yeah.net", "wdc20140772")

export function gentoken(email: string): string {
    const expried = Date.now() + 1000 * 60 * 60 * 24;
    const token = [
        email,
        expried.toString(),
    ].join(".");
    return aesEncrypt(token);
}

export function verifytoken(token: string): string | false {
    return token;
}
