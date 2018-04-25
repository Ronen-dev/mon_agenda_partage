import { User } from './user';

export interface Foyer {
    key: string,
    name: string;
    createdBy: User,
    users: User[];
}
