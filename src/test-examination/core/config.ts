import { TestExamnimationCoreConfig } from "./interfaces";

export const CONFIG_KEYS = {
    CONFIG: "test-examination.core.config",
};

export const configLoader = () => ({
    [CONFIG_KEYS.CONFIG]: {
        sessionURL: process.env.TEST_EXAMNIMATION_CORE_SESSION_URL,
    } as TestExamnimationCoreConfig,
});
