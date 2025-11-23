// ATIVIDADE 2

// aqui criei a classe abstrata que não pode ser instanciada, serve só como modelo para as subclasses
abstract class Funcionario {

    // atributos comuns para todos os tipos de funcionários
    public nome: string;
    public salario: number;
    public identificacao: string;

    constructor(nome: string, salario: number, id: string) {
        this.nome = nome;
        this.salario = salario;
        this.identificacao = id;
    }

    // método abstrato onde cada tipo de funcionário vai calcular o salário de um jeito diferente
    public abstract calcularSalario(): number;

    // método so para exibir dados
    public resumo(): void {
        console.log(`Funcionário: ${this.nome} | ID: ${this.identificacao}`);
    }
}

// herda de funcionario usando extends
class Gerente extends Funcionario {

    // o gerente recebe salário base + 20% de bônus
    public calcularSalario(): number {
        // 20% = salário * 0.20
        return this.salario + (this.salario * 0.20);
    }
}

class Desenvolvedor extends Funcionario {

    // atributo extra só do desenvolvedor
    private projetosEntregues: number;

    constructor(nome: string, salario: number, id: string, projetos: number) {
        super(nome, salario, id); // chama a classe mãe
        this.projetosEntregues = projetos;
    }

    public calcularSalario(): number {
        // 10% de bônus por projeto entregue
        const bonus = this.salario * 0.10 * this.projetosEntregues;
        return this.salario + bonus;
    }
}

class Estagiario extends Funcionario {

    // o estagiário ganha salário fixo
    public calcularSalario(): number {
        return this.salario;
    }
}

// objetos
const funcionarios: Funcionario[] = [

    // 4 gerentes
    new Gerente("Paula", 8000, "G01"),
    new Gerente("Rogério", 9000, "G02"),
    new Gerente("Fernanda", 7500, "G03"),
    new Gerente("Caio", 8500, "G04"),

    // 4 desenvolvedores
    new Desenvolvedor("Marcos", 5000, "D01", 3),
    new Desenvolvedor("Letícia", 6000, "D02", 5),
    new Desenvolvedor("Bruno", 5500, "D03", 1),
    new Desenvolvedor("Daniela", 5200, "D04", 4),

    // 4 estagiários
    new Estagiario("Ana", 1200, "E01"),
    new Estagiario("Carlos", 1300, "E02"),
    new Estagiario("João", 1100, "E03"),
    new Estagiario("Bianca", 1250, "E04")
];

// simulação
console.log("\n=========== INÍCIO DA SIMULAÇÃO ===========\n");

// aqui mesmo chamando o mesmo método quem decide qual versão será usada é o objeto real na lista
for (const f of funcionarios) {

    f.resumo(); // método comum a todos

    // aqui cada tipo de funcionario calcula de um jeito
    const salarioFinal = f.calcularSalario();

    console.log(`Salário calculado: R$ ${salarioFinal.toFixed(2)}\n`);
}

console.log("\n=========== FIM DA SIMULAÇÃO ===========\n");
