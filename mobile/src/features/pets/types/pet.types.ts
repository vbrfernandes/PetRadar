export interface Pet {
    id_pet: number;
    id_usuario: number;

    nome: string;
    especie: string;

    raca: string | null;

    // ALTERE AQUI
    sexo: string | null;

    // ALTERE AQUI
    cor: string | null;

    porte: string | null;

    // ALTERE AQUI
    idade: string | null;

    foto: string | null;
}
