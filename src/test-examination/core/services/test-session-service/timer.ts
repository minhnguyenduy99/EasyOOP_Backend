export class SessionTimer {
    protected hours = 0;
    protected minutes = 0;
    protected seconds = 0;
    constructor(miliseconds: number) {
        if (!miliseconds) {
            return;
        }
        const tempSeconds = Math.floor(miliseconds / 1000);
        this.hours = Math.floor(tempSeconds / 3600);
        this.minutes = Math.floor((tempSeconds - this.hours * 3600) / 60);
        this.seconds = tempSeconds - this.hours * 3600 - this.minutes * 60;
    }

    getSeconds() {
        return this.hours * 3600 + this.minutes * 60 + this.seconds;
    }

    getTimeObject() {
        return {
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
        };
    }

    toString() {
        let minuteStr = this.minutes.toString().padStart(2, "0");
        let secondStr = this.seconds.toString().padStart(2, "0");
        return `${this.hours}:${minuteStr}:${secondStr}`;
    }

    public static parse(second: number) {
        return new SessionTimer(second * 1000)
    }

    public static parseMs(milisecond: number) {
        return new SessionTimer(milisecond)
    }
}
