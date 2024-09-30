import { LaunchParams, retrieveLaunchParams } from "@telegram-apps/sdk";

const getLaunchParams = (): LaunchParams => {
    try {
        return retrieveLaunchParams();
    } catch {
        //TODO: Убрать
        return {
            initDataRaw: "2",
            initData: {
                user: {
                    id: 1331282319,
                    firstName: "John",
                    lastName: "Doe",
                    username: "johndoe",
                    languageCode: "en",
                    isBot: false,
                },
                queryId: "test",
                authDate: new Date(),
                hash: "test",
            },
            platform: "android",
            themeParams: {
            },
            version: "1.0.0",
        } as LaunchParams;
    }
}

export default getLaunchParams;