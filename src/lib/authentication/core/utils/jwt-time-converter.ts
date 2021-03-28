const JWT_TIME_UNITS = {
    second: "s",
    minute: "m",
    hour: "h",
    day: "d",
    month: "m",
    year: "y",
};

export class JwtTimeConverter {
    static JwtTimeToExpiredDate(issuedAt: number, jwtTime: String | number) {
        if (jwtTime instanceof String) {
            const unit = jwtTime[jwtTime.length - 1];
            let value = parseInt(jwtTime.slice(0, jwtTime.length - 1)) ?? 0;
            let time: Date;
            switch (unit) {
                case JWT_TIME_UNITS.second:
                    time = new Date(issuedAt + value * 1000);
                    break;
                case JWT_TIME_UNITS.minute:
                    time = new Date(issuedAt + value * 1000 * 60);
                    break;
                case JWT_TIME_UNITS.hour:
                    time = new Date(issuedAt + value * 1000 * 3600);
                    break;
                case JWT_TIME_UNITS.day:
                    time = new Date(issuedAt + value * 1000 * 3600 * 24);
                    break;
                case JWT_TIME_UNITS.month:
                    time = new Date(issuedAt + value * 1000 * 3600 * 24 * 30);
                    break;
                case JWT_TIME_UNITS.year:
                    time = new Date(
                        issuedAt + value * 1000 * 3600 * 24 * 30 * 365,
                    );
                    break;
                default:
                    time = new Date(issuedAt);
                    break;
            }
            return time;
        }
        return new Date(Date.now() + jwtTime * 1000);
    }
}
