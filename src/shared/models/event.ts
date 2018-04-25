import { User } from "./user";

export interface Event {
    key: string,
    user: User,
    title: string,
    startTime: Date,
    endTime: Date,
    allDay: false,
    visible: true
}
