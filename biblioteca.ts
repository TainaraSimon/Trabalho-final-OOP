// ATIVIDADE 1

class Livro {
    // atributos da classe livro
    public titulo: string;
    public autor: string;
    public editora: string;
    public anoPublicacao: number;

    // atributo que controla se o livro está disponível ou não
    private disponivel: boolean;

    // constructor pra iniciar o objeto com valores
    constructor(titulo: string, autor: string, editora: string, ano: number) {
        this.titulo = titulo;
        this.autor = autor;
        this.editora = editora;
        this.anoPublicacao = ano;
        this.disponivel = true; // true porque quando um livro entra na biblioteca ele normalmente começa disponível
    }

    // getter para saber se o livro tá disponível
    public isDisponivel(): boolean {
        return this.disponivel;
    }

    // método para emprestar um livro
    public emprestar(): boolean {
        // se já estiver emprestado não pode emprestar de novo
        if (!this.disponivel) {
            console.log(`O livro "${this.titulo}" já está emprestado!`);
            return false;
        }

        this.disponivel = false;
        console.log(`Livro emprestado: "${this.titulo}"`);
        return true;
    }

    // método para devolver o livro
    public devolver(): boolean {
        // se já estiver disponível significa que ninguém tinha ele
        if (this.disponivel) {
            console.log(`O livro "${this.titulo}" já está disponível, não tem o que devolver!`);
            return false;
        }

        this.disponivel = true;
        console.log(`Livro devolvido: "${this.titulo}"`);
        return true;
    }
}

class Membro {
    public nome: string;
    public identificacao: string;

    // lista de livros emprestados pelo membro
    private livrosEmprestados: Livro[] = [];

    constructor(nome: string, id: string) {
        this.nome = nome;
        this.identificacao = id;
    }

    // método para pegar um livro emprestado
    public pegarEmprestado(livro: Livro): void {
        console.log(`\n${this.nome} tentando pegar "${livro.titulo}"...`);

        // chama o metodo emprestar da classe livro
        if (livro.emprestar()) {
            this.livrosEmprestados.push(livro);
            console.log(`${this.nome} agora está com o livro "${livro.titulo}"`);
        } else {
            console.log(`${this.nome} não conseguiu pegar "${livro.titulo}"`);
        }
    }

    // método para devolver um livro
    public devolverLivro(livro: Livro): void {
        console.log(`\n${this.nome} tentando devolver "${livro.titulo}"...`);

        // verifica se o membro realmente tem o livro
        const index = this.livrosEmprestados.indexOf(livro);

        if (index === -1) {
            console.log(`${this.nome} não tem esse livro para devolver!`);
            return;
        }

        // chama o método devolver na classe livro
        if (livro.devolver()) {
            this.livrosEmprestados.splice(index, 1);
            console.log(`${this.nome} devolveu "${livro.titulo}" com sucesso.`);
        }
    }

    // mostrar livros que o membro está segurando
    public listarLivros(): void {
        console.log(`\nLivros com ${this.nome}:`);
        if (this.livrosEmprestados.length === 0) {
            console.log("Nenhum livro emprestado.");
            return;
        }

        for (const livro of this.livrosEmprestados) {
            console.log(`- ${livro.titulo}`);
        }
    }
}

// objetos

// 4 livros
const l1 = new Livro("O Hobbit", "Tolkien", "HarperCollins", 1937);
const l2 = new Livro("Dom Casmurro", "Machado de Assis", "Ática", 1899);
const l3 = new Livro("1984", "George Orwell", "Companhia das Letras", 1949);
const l4 = new Livro("A Revolução dos Bichos", "George Orwell", "Companhia das Letras", 1945);

// 3 membros
const m1 = new Membro("Ana", "M01");
const m2 = new Membro("Carlos", "M02");
const m3 = new Membro("Julia", "M03");

// simulação

console.log("\n================== INÍCIO DA SIMULAÇÃO ==================\n");

// as ações
m1.pegarEmprestado(l1); // ok
m2.pegarEmprestado(l1); // não pode
m2.pegarEmprestado(l2); // ok
m3.pegarEmprestado(l2); // não pode
m3.pegarEmprestado(l3); // ok

m1.devolverLivro(l1);   // ok
m2.pegarEmprestado(l1); // agora pode

m3.devolverLivro(l4);   // ela não tem da erro
m3.devolverLivro(l3);   // ok

m1.pegarEmprestado(l3); // ok

console.log("\n================== FIM DA SIMULAÇÃO ==================\n");

// mostrar o estado final
m1.listarLivros();
m2.listarLivros();
m3.listarLivros();
