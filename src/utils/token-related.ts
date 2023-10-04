import jwt from 'jsonwebtoken';

import { env } from "../env";


export function generateTokenWithUserId(userId: string) {
    const jwtSecret = env.JWT_SECRET;

    const token = jwt.sign(
        {
            userId: userId
        },
        jwtSecret,
        {
            expiresIn: '1d'
        }
    );

    return token;
}

export function extractTokenFromStringObject(stringObject: any) {
    let string = '';
    for (const letter in stringObject) {
        string += stringObject[letter];
    }

    if (!string) return false;

    return string.split(' ')[1].trim();
}

export function getUserNameFromToken(token: string) {
    const data = jwt.decode(token);

    return data;
}