const postag2path = {
    N: "SO",
    Np: "SO",
    Nc: "SO",
    Nu: "SO",
    V: "V",
    A: "V",
    P: "SO",
    L: "-",
    M: "-",
    R: "V",
    E: "-",
    C: "E",
    I: "-",
    T: "-",
    B: "-",
    Y: "A",
    S: "-",
    X: "A",
    CH: "E"
}

const o = {
    postag2path: postag2path,
    trustThreshold: process.env.TRUST_THRESHOLD ? Number.parseFloat(process.env.TRUST_THRESHOLD) : 0.7,
    askThreshold: process.env.ASK_THRESHOLD ? Number.parseFloat(process.env.ASK_THRESHOLD) : 0.3,
    nlpLimit: process.env.NLP_LIMIT ? Number.parseInt(process.env.NLP_LIMIT) : 4
}

export default o