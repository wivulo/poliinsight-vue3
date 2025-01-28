import { Group } from "./group.model"

export type User = {
    id: string
    email: string
    name: string
    nickname?: string
    gender: String
    birthday: string
    profilePictureURL: string
    course: string
    institution: string
    office: string
    documentProving: string
    department: string
    username: string
    password: string
    groups: Group[]
    groupId: number
    teamId: string
}