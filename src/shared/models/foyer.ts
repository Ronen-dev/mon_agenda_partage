import { User } from './user';

export interface Foyer {
    name: string;
    createdBy: User,
    users: User[];
}
