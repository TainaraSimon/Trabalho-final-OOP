//ATIVIDADE 3

class ContaBancaria {

    // saldo e histórico são privados porque são dados sensíveis
    private saldo: number;
    private titular: string;
    private numeroConta: string;

    // histórico de pagamentos cada item é uma string
    private historico: string[] = [];

    constructor(titular: string, numeroConta: string, saldoInicial: number) {
        this.titular = titular;
        this.numeroConta = numeroConta;
        this.saldo = saldoInicial;
    }

    // apenas para leitura do saldo 
    public getSaldo(): number {
        return this.saldo;
    }

    // apenas leitura do titular
    public getTitular(): string {
        return this.titular;
    }

    // função interna para descontar valores, é privado porque só a própria conta deve alterar o saldo
    private debitar(valor: number): boolean {
        if (valor <= 0) {
            return false;
        }
        if (this.saldo < valor) {
            return false;
        }
        this.saldo -= valor;
        return true;
    }

    // método público para ser usado pelos meios de pagamento
    public processarCobranca(valor: number, descricao: string): boolean {

        const sucesso = this.debitar(valor);

        if (sucesso) {
            this.historico.push(`Pagamento aprovado (${descricao}) → R$ ${valor}`);
        } else {
            this.historico.push(`Pagamento recusado (${descricao}) → R$ ${valor}`);
        }

        return sucesso;
    }

    // para exibir histórico da conta
    public mostrarHistorico(): void {
        console.log(`\nHistórico da conta: ${this.titular}`);
        this.historico.forEach(item => console.log(" - " + item));
    }
}

// interface do meio de pagamento
interface MeioPagamento {
    // todos os meios de pagamento precisam processar pagamentos.
    processarPagamento(valor: number, conta: ContaBancaria): void;
}

class CartaoCredito implements MeioPagamento {

    // dados sensíveis são privados
    private numero: string;
    private limite: number;
    private validade: string;

    constructor(numero: string, limite: number, validade: string) {
        this.numero = numero;
        this.limite = limite;
        this.validade = validade;
    }

    public processarPagamento(valor: number, conta: ContaBancaria): void {
        console.log(`\nTentando pagar via Cartão de Crédito...`);

        if (valor > this.limite) {
            console.log("Cartão de crédito: limite insuficiente!");
            conta.processarCobranca(0, "Cartão Crédito (Falhou)");
            return;
        }

        this.limite -= valor;
        conta.processarCobranca(valor, "Cartão Crédito");
        console.log("Pagamento aprovado (Crédito)");
    }
}

class CartaoDebito implements MeioPagamento {

    private numero: string;
    private senha: string;

    constructor(numero: string, senha: string) {
        this.numero = numero;
        this.senha = senha;
    }

    public processarPagamento(valor: number, conta: ContaBancaria): void {
        console.log(`\nTentando pagar via Cartão de Débito...`);

        // validação simples
        if (valor <= 0) {
            console.log("Débito inválido! Valor precisa ser positivo.");
            conta.processarCobranca(0, "Cartão Débito (Falhou)");
            return;
        }

        const aprovado = conta.processarCobranca(valor, "Cartão Débito");

        if (aprovado) {
            console.log("Pagamento aprovado (Débito)");
        } else {
            console.log("Saldo insuficiente no débito!");
        }
    }
}

class BoletoBancario implements MeioPagamento {

    private codigo: string;

    constructor(codigo: string) {
        this.codigo = codigo;
    }

    public processarPagamento(valor: number, conta: ContaBancaria): void {
        console.log(`\nTentando pagar via Boleto...`);

        const ok = conta.processarCobranca(valor, "Boleto Bancário");

        if (ok) {
            console.log("Boleto pago com sucesso!");
        } else {
            console.log("Falha ao pagar boleto (saldo insuficiente)");
        }
    }
}

class Pix implements MeioPagamento {

    private chave: string;

    constructor(chave: string) {
        this.chave = chave;
    }

    public processarPagamento(valor: number, conta: ContaBancaria): void {
        console.log(`\nTentando pagar via Pix...`);

        if (valor < 1) {
            console.log("Valor mínimo para PIX é R$ 1,00");
            conta.processarCobranca(0, "Pix (Falhou)");
            return;
        }

        const ok = conta.processarCobranca(valor, "PIX");

        if (ok) {
            console.log("Pagamento PIX aprovado!");
        } else {
            console.log("Falha no PIX — saldo insuficiente.");
        }
    }
}

// instancias das 4 contas
const c1 = new ContaBancaria("Ana", "001", 1500);
const c2 = new ContaBancaria("Pedro", "002", 500);
const c3 = new ContaBancaria("Mariana", "003", 3000);
const c4 = new ContaBancaria("Lucas", "004", 100);

// dos metodos de pagamento
const credito = new CartaoCredito("1111-2222-3333-4444", 2000, "12/30");
const debito = new CartaoDebito("5555-6666-7777-8888", "1234");
const boleto = new BoletoBancario("BOLETO123");
const pix = new Pix("ana@email.com");

// simulação
console.log("\n=========== INÍCIO DA SIMULAÇÃO ===========\n");

// 1-PIX
pix.processarPagamento(300, c1);      

// 2-Crédito válido
credito.processarPagamento(500, c3);    

// 3-Débito com saldo insuficiente
debito.processarPagamento(600, c2);      

// 4-Débito válido
debito.processarPagamento(100, c2);       

// 5-Boleto aprovado
boleto.processarPagamento(800, c3);       

// 6-Crédito limite insuficiente
credito.processarPagamento(5000, c1);     

// 7-PIX mínimo inválido
pix.processarPagamento(0.5, c4);          

// 8-PIX válido
pix.processarPagamento(50, c4);           

// 9-Boleto sem saldo suficiente
boleto.processarPagamento(300, c4);

// 10-Crédito válido
credito.processarPagamento(300, c1);

console.log("\n=========== FIM DA SIMULAÇÃO ===========");

// para exibir o historico das contas
c1.mostrarHistorico();
c2.mostrarHistorico();
c3.mostrarHistorico();
c4.mostrarHistorico();
