const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const GenerateDigitID = (length: number) => {
    let id = "";
    for (let i = 0; i < length; i++) {
        let random = Math.floor(Math.random() * 11);
        id += DIGITS[random];
    }
    return id;
};

export const GenerateAlphabetID = (length: number) => {
    let id = "";
    for (let i = 0; i < length; i++) {
        let random = Math.round(Math.random() * 37);
        id += DIGITS[random];
    }
    return id;
};
