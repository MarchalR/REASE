export class Result {
    public surface: number;
    public nbRoom: number;
    public postalCode: number;
    public price: number;
    public image: string[];
    public url: string;
    public isFavorite: boolean;
    public description: string;

    constructor( desc: string, superf: number, pieces: number, prix: number) {
        this.description = desc;
        this.surface = superf;
        this.nbRoom = pieces;
        this.price = prix;
    }
}
