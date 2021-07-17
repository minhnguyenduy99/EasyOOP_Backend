export const CONFIG_KEYS = {
    POST_URL: "CHATBOT_INTERGRATION_POST_URL",
};

export const configLoader = () => ({
    [CONFIG_KEYS.POST_URL]: process.env.CHATBOT_INTERGRATION_POST_URL,
});
