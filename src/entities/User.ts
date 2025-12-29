export default class User {
    id!: number;
    email!: string;
    name!: string;

    constructor(id: number, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}