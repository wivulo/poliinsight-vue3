type UserType = {
    id: string;
    name: string;
    email: string;
    userId: string;
    participantId: string;
    // ... outros campos se aplicável
}

type RegistrationType = {
    // Caso o usuário esteja diretamente no registro:
    user?: UserType;
    // Caso haja um participante único:
    participant?: UserType;
    // Caso seja um registro de time, pode ter:
    team?: {
        users?: UserType[];
        participants?: UserType[];
    };
    // Em alguns casos, o próprio objeto pode ser o time:
    participants?: UserType[];
}

export function extractUser(registration: RegistrationType, email: string): UserType | null {
    // 1. Se o registro tiver a propriedade "user"
    if (registration.user && registration.user.email === email) {
        return {
            userId: registration.user.id,
            ...registration.user
        };
    }
    // 2. Se o registro tiver a propriedade "participant"
    if (registration.participant && registration.participant.email === email) {
        return {
            participantId: registration.participant.id,
            ...registration.participant
        };
    }
    // 3. Se o registro for de um time com usuários
    if (registration.team?.users && registration.team.users.length) {
        const foundUser = registration.team.users.find(u => u.email === email);
        if (foundUser) {
            return {
                userId: foundUser.id,
                ...foundUser
            }
        }
    }
    // 4. Se o registro for de um time com participantes
    if (registration.team?.participants && registration.team.participants.length) {
        const foundParticipant = registration.team.participants.find(p => p.email === email);
        if (foundParticipant) {
            return {
                participantId: foundParticipant.id,
                ...foundParticipant
            }
        }
    }
    // 5. Se a própria estrutura for um time com uma lista de participantes
    if (registration.participants && registration.participants.length) {
        const found = registration.participants.find(p => p.email === email);
        if (found) return found;
    }
    return null;
}