export const KEYS = {
    endpoint: "mail-verification.endpoint",
};

export default () => ({
    [KEYS.endpoint]: process.env.MAIL_VERIFICATION_SERVICE_ENDPOINT,
});
