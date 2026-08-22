export interface Pet {
    id_pet: number;
    id_usuario: number;

    nome: string;
    especie: string;

    raca: string | null;
    sexo: string | null;
    cor: string | null;
    porte: string | null;
    idade: string | null;
    foto: string | null;
}
