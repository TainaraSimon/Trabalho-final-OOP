// ATIVIDADE 4

// tipos e enums
type ID = number;

enum TipoUsuario {
  ESTUDANTE = "estudante",
  PROFESSOR = "professor",
  COMUM = "comum",
}

enum TipoEmprestimo {
  NORMAL = "normal",
  RENOVACAO = "renovacao",
  EXPRESSO = "expresso",
}

// entidades
class Livro {
  // atributos privados para aplicar o encapsulamento 
  private _id: ID;
  private _titulo: string;
  private _autor: string;
  private _ano: number;
  private _quantidade: number;
  private _disponiveis: number;
  private _categoria: string;
  private _preco: number;

  constructor(
    id: ID,
    titulo: string,
    autor: string,
    ano: number,
    quantidade: number,
    categoria: string,
    preco: number
  ) {
    this._id = id;
    this._titulo = titulo;
    this._autor = autor;
    this._ano = ano;
    this._quantidade = quantidade;
    this._disponiveis = quantidade; // inicialmente todos estão disponíveis
    this._categoria = categoria;
    this._preco = preco;
  }

  // getters 
  public get id() { return this._id; }
  public get titulo() { return this._titulo; }
  public get autor() { return this._autor; }
  public get ano() { return this._ano; }
  public get quantidade() { return this._quantidade; }
  public get disponiveis() { return this._disponiveis; }
  public get categoria() { return this._categoria; }
  public get preco() { return this._preco; }

  // os métodos que alteram o estado do livro 
  public emprestar(): boolean {
    if (this._disponiveis <= 0) return false;
    this._disponiveis--;
    return true;
  }

  public devolver(): void {
    if (this._disponiveis < this._quantidade) {
      this._disponiveis++;
    }
  }

  // para atualizar a quantidade com validação
  public ajustarQuantidade(novaQuantidade: number): void {
    if (novaQuantidade < 0) throw new Error("Quantidade não pode ser negativa");
    this._quantidade = novaQuantidade;
    // ajustar os disponiveis 
    if (this._disponiveis > novaQuantidade) this._disponiveis = novaQuantidade;
  }
}


// usuário do sistema
class Usuario {
  private _id: ID;
  private _nome: string;
  private _cpf: string;
  private _tipo: TipoUsuario;
  private _ativo: boolean;
  private _multas: number;
  private _telefone: string;

  constructor(id: ID, nome: string, cpf: string, tipo: TipoUsuario, telefone: string) {
    this._id = id;
    this._nome = nome;
    this._cpf = cpf;
    this._tipo = tipo;
    this._ativo = true;
    this._multas = 0;
    this._telefone = telefone;
  }

  public get id() { return this._id; }
  public get nome() { return this._nome; }
  public get cpf() { return this._cpf; }
  public get tipo() { return this._tipo; }
  public get ativo() { return this._ativo; }
  public get multas() { return this._multas; }
  public get telefone() { return this._telefone; }

  public inativar(): void { this._ativo = false; }
  public ativar(): void { this._ativo = true; }

  public adicionarMulta(valor: number): void {
    if (valor <= 0) return;
    this._multas += valor;
  }

  public pagarMulta(valor: number): boolean {
    if (valor <= 0) return false;
    if (valor > this._multas) return false; // pagar mais que tem não permitido aqui
    this._multas -= valor;
    return true;
  }
}

// registro de empréstimo 
class Emprestimo {
  public readonly id: ID;
  public readonly usuarioId: ID;
  public readonly livroId: ID;
  public dataEmprestimo: Date;
  public dataDevolucaoPrevista: Date;
  public dataDevolucaoReal?: Date;
  public diasSolicitados: number;
  public taxaMultaDiaria: number;
  public devolvido: boolean;
  public tipo: TipoEmprestimo;
  public multaAplicada: number = 0;

  constructor(
    id: ID,
    usuarioId: ID,
    livroId: ID,
    diasSolicitados: number,
    taxaMultaDiaria: number,
    tipo: TipoEmprestimo
  ) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.livroId = livroId;
    this.dataEmprestimo = new Date();
    this.diasSolicitados = diasSolicitados;
    this.taxaMultaDiaria = taxaMultaDiaria;
    this.tipo = tipo;
    this.devolvido = false;
    this.dataDevolucaoPrevista = new Date();
    this.dataDevolucaoPrevista.setDate(this.dataEmprestimo.getDate() + diasSolicitados);
  }

  // marcar devolução e calcular uma multa se tiver
  public marcarDevolucao(): { diasAtraso: number; multa: number } {
    if (this.devolvido) throw new Error("Empréstimo já devolvido");
    const hoje = new Date();
    this.dataDevolucaoReal = hoje;
    let diasAtraso = 0;
    if (hoje > this.dataDevolucaoPrevista) {
      diasAtraso = Math.floor((hoje.getTime() - this.dataDevolucaoPrevista.getTime()) / (1000 * 60 * 60 * 24));
    }
    const multa = diasAtraso * this.taxaMultaDiaria;
    this.multaAplicada = multa;
    this.devolvido = true;
    return { diasAtraso, multa };
  }
}

// serviços
class Notificador {
  // simples serviço de notificação 
  public static notificarEmail(destinatario: string, mensagem: string) {
    console.log(`Email para ${destinatario}: ${mensagem}`);
  }

  public static notificarSMS(numero: string, mensagem: string) {
    console.log(`SMS para ${numero}: ${mensagem}`);
  }

  public static notificarWhatsApp(destinatario: string, mensagem: string) {
    console.log(`WhatsApp para ${destinatario}: ${mensagem}`);
  }
}

class ComprovantePrinter {
  public static imprimirComprovanteEmprestimo(e: Emprestimo, usuario: Usuario, livro: Livro) {
    console.log("\n╔════════════════════════════════════╗");
    console.log("║     COMPROVANTE DE EMPRÉSTIMO      ║");
    console.log("╠════════════════════════════════════╣");
    console.log(`║ ID: ${e.id}`);
    console.log(`║ Usuário: ${usuario.nome}`);
    console.log(`║ CPF: ${usuario.cpf}`);
    console.log(`║ Livro: ${livro.titulo}`);
    console.log(`║ Autor: ${livro.autor}`);
    console.log(`║ Data Empréstimo: ${e.dataEmprestimo.toLocaleDateString()}`);
    console.log(`║ Data Devolução: ${e.dataDevolucaoPrevista.toLocaleDateString()}`);
    console.log(`║ Tipo: ${e.tipo}`);
    console.log(`║ Multa/dia atraso: R$${e.taxaMultaDiaria}`);
    console.log("╚════════════════════════════════════╝\n");
  }

  public static imprimirComprovanteDevolucao(e: Emprestimo, usuario: Usuario, livro: Livro, diasAtraso: number, multa: number) {
    console.log("\n╔════════════════════════════════════╗");
    console.log("║     COMPROVANTE DE DEVOLUÇÃO       ║");
    console.log("╠════════════════════════════════════╣");
    console.log(`║ Usuário: ${usuario.nome}`);
    console.log(`║ Livro: ${livro.titulo}`);
    console.log(`║ Data Devolução: ${e.dataDevolucaoReal?.toLocaleDateString()}`);
    console.log(`║ Dias de Atraso: ${diasAtraso}`);
    console.log(`║ Multa: R$${multa.toFixed(2)}`);
    console.log(`║ Total de multas pendentes: R$${usuario.multas.toFixed(2)}`);
    console.log("╚════════════════════════════════════╝\n");
  }
}

// repositorios simples
class Biblioteca {
  private livros: Map<ID, Livro> = new Map();
  private usuarios: Map<ID, Usuario> = new Map();
  private emprestimos: Map<ID, Emprestimo> = new Map();
  private reservas: Array<{ id: ID; usuarioId: ID; livroId: ID; ativo: boolean }> = [];
  private proximoIdEmprestimo: ID = 1;

  public carregarDadosIniciais() {
    // livros
    this.adicionarLivroNovo(new Livro(1, "Clean Code", "Robert Martin", 2008, 3, "tecnologia", 89.9));
    this.adicionarLivroNovo(new Livro(2, "1984", "George Orwell", 1949, 2, "ficcao", 45.0));
    this.adicionarLivroNovo(new Livro(3, "Sapiens", "Yuval Harari", 2011, 4, "historia", 65.5));
    this.adicionarLivroNovo(new Livro(4, "O Hobbit", "Tolkien", 1937, 2, "fantasia", 55.0));

    // usuarios
    this.cadastrarUsuarioNovo(new Usuario(1, "Ana Silva", "12345678901", TipoUsuario.ESTUDANTE, "48999999999"));
    this.cadastrarUsuarioNovo(new Usuario(2, "Carlos Santos", "98765432100", TipoUsuario.PROFESSOR, "48988888888"));
    const bea = new Usuario(3, "Beatriz Costa", "11122233344", TipoUsuario.COMUM, "48977777777");
    bea.inativar();
    this.cadastrarUsuarioNovo(bea);
    // adicionar multa ao usuario 2 para simular a situação
    this.usuarios.get(2)?.adicionarMulta(15.5);
  }

  // métodos públicos 
  // adicionar livro 
  public adicionarLivroNovo(livro: Livro): void {
    if (this.livros.has(livro.id)) {
      throw new Error("Livro com esse ID já existe");
    }
    this.livros.set(livro.id, livro);
    console.log(`Livro '${livro.titulo}' adicionado com sucesso!`);
  }

  // cadastrar usuário com validações básicas
  public cadastrarUsuarioNovo(usuario: Usuario): void {
    if (this.usuarios.has(usuario.id)) {
      throw new Error("Usuário com esse ID já existe");
    }
    this.usuarios.set(usuario.id, usuario);
    console.log(`Usuário '${usuario.nome}' cadastrado com sucesso!`);
  }

  // buscar livro por termo 
  public buscarLivros(termo: string): Livro[] {
    const termoLower = termo.toLowerCase();
    const encontrados: Livro[] = [];
    for (const livro of this.livros.values()) {
      if (livro.titulo.toLowerCase().includes(termoLower) || livro.autor.toLowerCase().includes(termoLower)) {
        encontrados.push(livro);
      }
    }
    return encontrados;
  }

  // calcular limites e taxas baseado no tipo de usuário e tipo de empréstimo
  private regrasPara(tipoUsuario: TipoUsuario, tipoEmprestimo: TipoEmprestimo): { diasPermitidos: number; taxaMultaDiaria: number } {
    // regras centralizadas 
    const regras: Record<TipoEmprestimo, Record<TipoUsuario, { dias: number; taxa: number }>> = {
      [TipoEmprestimo.NORMAL]: {
        [TipoUsuario.ESTUDANTE]: { dias: 14, taxa: 0.5 },
        [TipoUsuario.PROFESSOR]: { dias: 30, taxa: 0.3 },
        [TipoUsuario.COMUM]: { dias: 7, taxa: 1.0 },
      },
      [TipoEmprestimo.RENOVACAO]: {
        [TipoUsuario.ESTUDANTE]: { dias: 7, taxa: 0.5 },
        [TipoUsuario.PROFESSOR]: { dias: 15, taxa: 0.3 },
        [TipoUsuario.COMUM]: { dias: 3, taxa: 1.0 },
      },
      [TipoEmprestimo.EXPRESSO]: {
        [TipoUsuario.ESTUDANTE]: { dias: 1, taxa: 5.0 },
        [TipoUsuario.PROFESSOR]: { dias: 1, taxa: 5.0 },
        [TipoUsuario.COMUM]: { dias: 1, taxa: 5.0 },
      },
    };

    return {
      diasPermitidos: regras[tipoEmprestimo][tipoUsuario].dias,
      taxaMultaDiaria: regras[tipoEmprestimo][tipoUsuario].taxa,
    };
  }

  // quantos empréstimos ativos um usuário tem
  private contarEmprestimosAtivos(usuarioId: ID): number {
    let cont = 0;
    for (const e of this.emprestimos.values()) {
      if (e.usuarioId === usuarioId && !e.devolvido) cont++;
    }
    return cont;
  }

  // limite por tipo de usuário
  private limitePorTipo(tipo: TipoUsuario): number {
    if (tipo === TipoUsuario.ESTUDANTE) return 3;
    if (tipo === TipoUsuario.PROFESSOR) return 5;
    return 2;
  }

  // para realizar um empréstimo 
  public realizarEmprestimo(usuarioId: ID, livroId: ID, dias: number, tipoEmprestimo: TipoEmprestimo): void {
    console.log("\n=== PROCESSANDO EMPRÉSTIMO (refatorado) ===");

    const usuario = this.usuarios.get(usuarioId);
    if (!usuario) {
      console.log("ERRO: Usuário não encontrado!");
      return;
    }
    if (!usuario.ativo) {
      console.log("ERRO: Usuário inativo!");
      return;
    }
    if (usuario.multas > 0) {
      console.log(`ERRO: Usuário possui multas pendentes de R$${usuario.multas.toFixed(2)}`);
      return;
    }

    const livro = this.livros.get(livroId);
    if (!livro) {
      console.log("ERRO: Livro não encontrado!");
      return;
    }
    if (livro.disponiveis <= 0) {
      console.log("ERRO: Livro indisponível no momento!");
      return;
    }

    // regras centralizadas
    const { diasPermitidos, taxaMultaDiaria } = this.regrasPara(usuario.tipo, tipoEmprestimo);

    if (dias > diasPermitidos) {
      console.log(`ERRO: Período solicitado (${dias} dias) excede o permitido (${diasPermitidos} dias) para esse tipo de empréstimo.`);
      return;
    }

    // verifica limite de empréstimos do usuário
    const emprestimosAtivos = this.contarEmprestimosAtivos(usuarioId);
    const limite = this.limitePorTipo(usuario.tipo);
    if (emprestimosAtivos >= limite) {
      console.log(`ERRO: Usuário já atingiu o limite de ${limite} empréstimos simultâneos!`);
      return;
    }

    // processa efetivamente
    const emprestou = livro.emprestar();
    if (!emprestou) {
      console.log("Falha ao emprestar: problema ao decrementar disponibilidade");
      return;
    }

    const idEmp = this.proximoIdEmprestimo++;
    const emprestimo = new Emprestimo(idEmp, usuarioId, livroId, dias, taxaMultaDiaria, tipoEmprestimo);
    this.emprestimos.set(idEmp, emprestimo);

    // notificações
    Notificador.notificarEmail(usuario.nome, "Empréstimo realizado com sucesso!");
    Notificador.notificarSMS(usuario.telefone, `Livro '${livro.titulo}' deve ser devolvido até ${emprestimo.dataDevolucaoPrevista.toLocaleDateString()}`);
    Notificador.notificarWhatsApp(usuario.nome, "Seu empréstimo foi confirmado!");

    ComprovantePrinter.imprimirComprovanteEmprestimo(emprestimo, usuario, livro);

    console.log(`[LOG] ${new Date().toISOString()} - Empréstimo ID ${idEmp} criado`);
  }

  // realizar a devolução 
  public realizarDevolucao(emprestimoId: ID): void {
    console.log("\n=== PROCESSANDO DEVOLUÇÃO (refatorado) ===");
    const emprestimo = this.emprestimos.get(emprestimoId);
    if (!emprestimo) {
      console.log("ERRO: Empréstimo não encontrado!");
      return;
    }
    if (emprestimo.devolvido) {
      console.log("ERRO: Este livro já foi devolvido!");
      return;
    }

    const usuario = this.usuarios.get(emprestimo.usuarioId);
    const livro = this.livros.get(emprestimo.livroId);
    if (!usuario || !livro) {
      console.log("ERRO: Dados inconsistentes no empréstimo!");
      return;
    }

    const { diasAtraso, multa } = emprestimo.marcarDevolucao();

    if (multa > 0) {
      usuario.adicionarMulta(multa);
      Notificador.notificarEmail(usuario.nome, `Multa de R$${multa.toFixed(2)} aplicada`);
      Notificador.notificarSMS(usuario.telefone, "Você possui multa pendente");
    } else {
      console.log("Devolução dentro do prazo. Sem multas!");
    }

    // atualizar disponibilidade do livro
    livro.devolver();

    // verificar reservas ativas e notificar 
    for (const r of this.reservas) {
      if (r.livroId === livro.id && r.ativo) {
        const usr = this.usuarios.get(r.usuarioId);
        if (usr) {
          Notificador.notificarEmail(usr.nome, `Livro '${livro.titulo}' está disponível!`);
        }
      }
    }

    ComprovantePrinter.imprimirComprovanteDevolucao(emprestimo, usuario, livro, diasAtraso, multa);

    console.log(`[LOG] ${new Date().toISOString()} - Devolução do empréstimo ID ${emprestimoId}`);
  }

  // gerar relatório 
  public gerarRelatorio(): {
    totalLivros: number;
    livrosDisponiveis: number;
    valorTotalAcervo: number;
    totalUsuarios: number;
    usuariosAtivos: number;
    totalMultas: number;
    totalEmprestimos: number;
    emprestimosAtivos: number;
    emprestimosAtrasados: number;
    rankingTop?: Array<{ livroId: ID; titulo: string; count: number }>;
  } {
    let totalLivros = 0;
    let livrosDisponiveis = 0;
    let valorTotal = 0;
    for (const l of this.livros.values()) {
      totalLivros += l.quantidade;
      livrosDisponiveis += l.disponiveis;
      valorTotal += l.preco * l.quantidade;
    }

    let usuariosAtivos = 0;
    let totalMultas = 0;
    for (const u of this.usuarios.values()) {
      if (u.ativo) usuariosAtivos++;
      totalMultas += u.multas;
    }

    let emprestimosAtivos = 0;
    let emprestimosAtrasados = 0;
    const hoje = new Date();
    for (const e of this.emprestimos.values()) {
      if (!e.devolvido) {
        emprestimosAtivos++;
        if (e.dataDevolucaoPrevista < hoje) emprestimosAtrasados++;
      }
    }

    // ranking 
    const contagem: Record<ID, number> = {};
    for (const e of this.emprestimos.values()) {
      contagem[e.livroId] = (contagem[e.livroId] ?? 0) + 1;
    }

    const ranking = Object.keys(contagem)
      .map(k => ({ livroId: Number(k), count: contagem[Number(k)] ?? 0 }))
      .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
      .slice(0, 3)
      .map(r => {
        const l = this.livros.get(r.livroId)!;
        return { livroId: r.livroId, titulo: l.titulo, count: r.count };
      });

    return {
      totalLivros,
      livrosDisponiveis,
      valorTotalAcervo: valorTotal,
      totalUsuarios: this.usuarios.size,
      usuariosAtivos,
      totalMultas,
      totalEmprestimos: this.emprestimos.size,
      emprestimosAtivos,
      emprestimosAtrasados,
      rankingTop: ranking,
    };
  }
}

// simulação
function mainSimulacao() {
  console.log("╔═══════════════════════════════════════════╗");
  console.log("║   SISTEMA DE GERENCIAMENTO DE BIBLIOTECA  ║");
  console.log("╚═══════════════════════════════════════════╝");

  const biblioteca = new Biblioteca();
  biblioteca.carregarDadosIniciais();

  console.log("\n--- TESTE 1: Empréstimo Normal (Ana pega 'Clean Code') ---");
  biblioteca.realizarEmprestimo(1, 1, 10, TipoEmprestimo.NORMAL);

  console.log("\n--- TESTE 2: Empréstimo para Professor (Carlos pega '1984') ---");
  biblioteca.realizarEmprestimo(2, 2, 20, TipoEmprestimo.NORMAL);

  console.log("\n--- TESTE 3: Tentativa de empréstimo com multa pendente (Carlos) ---");
  biblioteca.realizarEmprestimo(2, 3, 5, TipoEmprestimo.NORMAL); // Carlos tem multa -> deve bloquear

  console.log("\n--- TESTE 4: Buscar livros (termo 'code') ---");
  const resultados = biblioteca.buscarLivros("code");
  if (resultados.length === 0) console.log("Nenhum livro encontrado.");
  else resultados.forEach(l => {
    console.log(`- ${l.titulo} (${l.autor}) - Disponíveis: ${l.disponiveis}/${l.quantidade}`);
  });

  console.log("\n--- TESTE 5: Devolução (devolver empréstimo 1) ---");
  biblioteca.realizarDevolucao(1);

  console.log("\n--- TESTE 6: Adicionar novo livro (Design Patterns) ---");
  biblioteca.adicionarLivroNovo(new Livro(5, "Design Patterns", "Gang of Four", 1994, 2, "tecnologia", 120.0));

  console.log("\n--- TESTE 7: Cadastrar novo usuário (Diego) ---");
  biblioteca.cadastrarUsuarioNovo(new Usuario(4, "Diego Souza", "55566677788", TipoUsuario.ESTUDANTE, "48966666666"));

  console.log("\n--- GERAR RELATÓRIO ---");
  const rel = biblioteca.gerarRelatorio();
  console.log(`Total de exemplares: ${rel.totalLivros}`);
  console.log(`Disponíveis: ${rel.livrosDisponiveis}`);
  console.log(`Valor total do acervo: R$${rel.valorTotalAcervo.toFixed(2)}`);
  console.log(`Total de usuários: ${rel.totalUsuarios} (ativos: ${rel.usuariosAtivos})`);
  console.log(`Total de empréstimos: ${rel.totalEmprestimos} (ativos: ${rel.emprestimosAtivos}, atrasados: ${rel.emprestimosAtrasados})`);
  console.log("--- TOP 3 ---");
  rel.rankingTop?.forEach((r, i) => console.log(`${i + 1}. ${r.titulo} (${r.count} empréstimos)`));
}

mainSimulacao();

// Oportunidades de refatoração: Durante a refatoração eu percebi vários problemas no código original. 
// O principal foi que tudo estava junto em uma única classe gigante, fazendo várias coisas ao mesmo 
// tempo. Eu separei essas responsabilidades em classes específicas, como Livro, Usuario, Emprestimo, 
// Notificador e Printer, deixando tudo mais organizado e fácil de entender. Também percebi que quase 
// nenhum atributo tinha encapsulamento, então qualquer parte do código podia alterar dados importantes. 
// Eu resolvi isso deixando tudo privado e criando getters e métodos seguros para alterar o estado. Outro 
// problema que eu notei foi a repetição de várias validações e regras. Então eu centralizei essas regras 
// em métodos específicos, como o método que define os dias permitidos e a taxa de multa, evitando 
// repetição e deixando mais fácil de manter depois. Além disso, o código misturava lógica com prints no 
// console. Eu separei isso criando classes que só cuidam de imprimir comprovantes e enviar notificações.

// O que aconteceria a longo prazo se o código não fosse refatorado: Na minha visão, se o código 
// continuasse do jeito que estava, ele ficaria cada vez mais difícil de mexer. Como tudo estava 
// misturado numa classe gigante, qualquer mudança pequena poderia quebrar várias partes do sistema. 
// Além disso, sem encapsulamento, os dados poderiam ser alterados de qualquer lugar, gerando erros 
// difíceis de achar. No longo prazo, eu acho que o sistema se tornaria praticamente impossível de 
// manter. 


