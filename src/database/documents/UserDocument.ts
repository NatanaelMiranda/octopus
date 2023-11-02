interface UserWallet {
    coins?: number
}
interface UserPerfil {
    description?: string,
    color?: string
}

export interface UserDocument {
    username: string,
    wallet?: UserWallet,
    perfil?: UserPerfil
}