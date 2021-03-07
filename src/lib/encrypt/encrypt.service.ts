import { Injectable } from "@nestjs/common";
import { hashSync, genSalt, compare } from "bcrypt";

@Injectable()
export class EncryptService {
    async hash(input: string) {
        const salt = await genSalt();
        return hashSync(input, salt);
    }

    async compare(plain: string, hash: string) {
        return await compare(plain, hash);
    }
}
