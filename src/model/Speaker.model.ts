export type Speaker = {
    id: string | null,
    name: string,
    email: string,
    photo: any,
    phone: number,
    imageURL: string | null,
    description: string | null,
    eventId: string
}

export type CreateSpeaker = {
    name: string,
    email: string,
    photo: any,
    phone: number,
    imageURL: string | null,
    description: string | null,
}