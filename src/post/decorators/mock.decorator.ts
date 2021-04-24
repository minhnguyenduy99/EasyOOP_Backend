import { createParamDecorator } from "@nestjs/common";

const MOCK_MANAGER = {
    manager_id: "12345678910",
};

const MOCK_AUTHOR = {
    author_id: "123456789",
    manager_id: MOCK_MANAGER.manager_id,
};

export const MockManager = createParamDecorator(() => MOCK_MANAGER);

export const MockAuthor = createParamDecorator(() => MOCK_AUTHOR);
