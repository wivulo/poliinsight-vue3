import { User } from "./user.model";

export type ActivityType = {
    id: number;
    name: string; // Ex.: "Palestra de Abertura", "Mesa Redonda"
    description?: string;
    typeId: number;
    type: ActivityType;
    startTime: string;
    endTime: string;
    location?: string;
    trackId?: string;
    track?: {
        id: string;
        name: string;
    };
    eventId: string;
    event: Event;
    sessions: Array<any>;
    speakers: Array<any>;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    guests: GuestType[];
};

export type GuestType = {
    id?: string;
    name?: string;
    email?: string;
    phone: string;
    imageURL?: string;
    biography?: string;
    roleInActivity: string;
    userId?: string;
    activityId: number;
    createdAt?: Date;
    deletedAt?: Date;
    updatedAt?: Date;
    user?: User;
};
