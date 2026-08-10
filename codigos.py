import os
from pathlib import Path
from typing import List, Set

# ==============================================================================
# CONFIGURAÇÕES DE CAMINHO E DIRETÓRIOS
# ==============================================================================

# Caminho base do código-fonte do projeto (pasta onde este script está salvo)
RAIZ_PROJETO = Path(__file__).resolve().parent

# Pasta de destino onde os arquivos .txt consolidados serão salvos
PASTA_SAIDA = RAIZ_PROJETO

# Nomes dos arquivos TXT de saída
NOME_ARQUIVO_COMPLETO = "codigo_projeto_consolidado.txt"
NOME_ARQUIVO_BACKEND = "codigo_backend_consolidado.txt"
NOME_ARQUIVO_FRONTEND = "codigo_frontend_consolidado.txt"

# 1. Diretórios para varredura recursiva
DIRETORIOS_BACKEND: List[Path] = [
    RAIZ_PROJETO / "backend" / "app",
    RAIZ_PROJETO / "backend" / "alembic",
]

DIRETORIOS_FRONTEND: List[Path] = [
    RAIZ_PROJETO / "mobile",
]

# 2. Arquivos de configuração específicos fora das subpastas
ARQUIVOS_BACKEND: List[Path] = [
    RAIZ_PROJETO / "backend" / "docker-compose.yml",
    RAIZ_PROJETO / "backend" / "alembic.ini",
    RAIZ_PROJETO / "backend" / "requirements.txt",
    RAIZ_PROJETO / "backend" / ".env.example",
    RAIZ_PROJETO / "backend" / "alembic" / "env.py",
]

ARQUIVOS_FRONTEND: List[Path] = [
    RAIZ_PROJETO / "mobile" / "package.json",
    RAIZ_PROJETO / "mobile" / "app.json",
    RAIZ_PROJETO / "mobile" / "tsconfig.json",
]

# Pastas ignoradas na varredura
PASTAS_IGNORADAS: Set[str] = {
    ".git", ".venv", "venv", "__pycache__", "node_modules",
    ".expo", "android", "ios", "assets", ".vscode", ".idea", "build", "dist", ".bundle"
}

# Arquivos ignorados (travas de pacotes e os próprios arquivos de saída)
ARQUIVOS_IGNORADOS: Set[str] = {
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb",
    ".env",
    NOME_ARQUIVO_COMPLETO, NOME_ARQUIVO_BACKEND, NOME_ARQUIVO_FRONTEND, "exportar_frontend.py"
}

# Extensões permitidas para leitura
EXTENSOES_RELEVANTES: Set[str] = {
    ".py", ".ts", ".tsx", ".js", ".jsx", ".json", ".sql",
    ".ini", ".yml", ".yaml", ".md", ".mako", ".env"
}

# Nomes exatos de arquivos permitidos
NOMES_PERMITIDOS: Set[str] = {
    ".env.example", "docker-compose.yml", "alembic.ini", "requirements.txt",
    "package.json", "app.json", "tsconfig.json", "env.py"
}

TAMANHO_MAXIMO_KB = 500


# ==============================================================================
# FUNÇÕES AUXILIARES
# ==============================================================================

def eh_arquivo_valido(caminho: Path) -> bool:
    """Valida se o arquivo atende aos critérios de leitura e tamanho."""
    if not caminho.is_file():
        return False
    if any(part in PASTAS_IGNORADAS for part in caminho.parts):
        return False
    if caminho.name in ARQUIVOS_IGNORADOS:
        return False
    try:
        if caminho.stat().st_size > (TAMANHO_MAXIMO_KB * 1024):
            return False
    except Exception:
        return False

    valido_por_nome = caminho.name in NOMES_PERMITIDOS
    valido_por_extensao = caminho.suffix.lower() in EXTENSOES_RELEVANTES

    return valido_por_nome or valido_por_extensao


def gerar_arvore_diretorios(diretorio: Path, prefixo: str = "") -> str:
    """Gera visualização hierárquica das pastas selecionadas."""
    linhas = []
    if not diretorio.exists():
        return ""

    itens = sorted(
        [
            item for item in diretorio.iterdir()
            if item.name not in PASTAS_IGNORADAS and not item.name.startswith(".claude")
            and (item.is_dir() or eh_arquivo_valido(item))
        ],
        key=lambda x: (not x.is_dir(), x.name.lower())
    )

    for index, item in enumerate(itens):
        e_ultimo = (index == len(itens) - 1)
        conector = "└── " if e_ultimo else "├── "
        linhas.append(f"{prefixo}{conector}{item.name}")

        if item.is_dir():
            extensao_prefixo = "    " if e_ultimo else "│   "
            linhas.append(gerar_arvore_diretorios(item, prefixo + extensao_prefixo))

    return "\n".join(linhas)


def coletar_arquivos_ordenados(diretorios: List[Path], arquivos_avulsos: List[Path]) -> List[Path]:
    """
    Coleta e ordena os arquivos válidos de forma determinística
    (de cima para baixo na hierarquia do repositório).
    """
    arquivos_encontrados: Set[Path] = set()

    for diretorio in diretorios:
        if diretorio.exists():
            for caminho in diretorio.rglob("*"):
                if eh_arquivo_valido(caminho):
                    arquivos_encontrados.add(caminho.resolve())

    for arq in arquivos_avulsos:
        if arq.exists() and eh_arquivo_valido(arq):
            arquivos_encontrados.add(arq.resolve())

    def chave_ordenacao(p: Path) -> str:
        try:
            return str(p.relative_to(RAIZ_PROJETO)).lower()
        except ValueError:
            return str(p).lower()

    return sorted(list(arquivos_encontrados), key=chave_ordenacao)


def gerar_arquivo_txt(
    caminho_saida: Path,
    titulo_modulo: str,
    diretorios: List[Path],
    arquivos_avulsos: List[Path],
    lista_arquivos: List[Path]
) -> None:
    """Gera um arquivo TXT de saída formatado com estrutura, índice e conteúdo."""
    with open(caminho_saida, "w", encoding="utf-8") as saida:
        # -------------------------------------------------------------
        # PARTE 1: ARQUITETURA E ESTRUTURA DE DIRETÓRIOS
        # -------------------------------------------------------------
        saida.write("=" * 80 + "\n")
        saida.write(f"ARQUITETURA DO PROJETO - {titulo_modulo.upper()}\n")
        saida.write("=" * 80 + "\n\n")

        for diretorio in diretorios:
            if diretorio.exists():
                try:
                    rel = diretorio.relative_to(RAIZ_PROJETO)
                except ValueError:
                    rel = diretorio
                saida.write(f"📁 {rel}\n")
                saida.write(gerar_arvore_diretorios(diretorio) + "\n\n")

        if arquivos_avulsos:
            saida.write("📄 ARQUIVOS DE CONFIGURAÇÃO ADICIONADOS:\n")
            for arq in arquivos_avulsos:
                if arq.exists():
                    try:
                        rel = arq.relative_to(RAIZ_PROJETO)
                    except ValueError:
                        rel = arq
                    saida.write(f"  └── {rel}\n")
            saida.write("\n")

        # -------------------------------------------------------------
        # PARTE 2: ÍNDICE DE ROTAS DOS ARQUIVOS
        # -------------------------------------------------------------
        saida.write("=" * 80 + "\n")
        saida.write("ROTAS E SEQUÊNCIA DOS ARQUIVOS INCLUÍDOS (ORDENADOS DE CIMA PARA BAIXO)\n")
        saida.write("=" * 80 + "\n\n")

        for idx, arq in enumerate(lista_arquivos, 1):
            try:
                caminho_rel = arq.relative_to(RAIZ_PROJETO)
            except ValueError:
                caminho_rel = arq
            saida.write(f"{idx:02d}. {caminho_rel}\n")
        saida.write("\n")

        # -------------------------------------------------------------
        # PARTE 3: LEITURA E GRAVAÇÃO DO CONTEÚDO DOS CÓDIGOS
        # -------------------------------------------------------------
        saida.write("=" * 80 + "\n")
        saida.write("CÓDIGO-FONTE E SCRIPTS DE CONFIGURAÇÃO\n")
        saida.write("=" * 80 + "\n\n")

        for arq in lista_arquivos:
            try:
                caminho_relativo = arq.relative_to(RAIZ_PROJETO)
            except ValueError:
                caminho_relativo = arq

            saida.write(f"\n{'=' * 80}\n")
            saida.write(f"CAMINHO: {caminho_relativo}\n")
            saida.write(f"{'=' * 80}\n\n")

            try:
                conteudo = arq.read_text(encoding="utf-8", errors="ignore")
                saida.write(conteudo + "\n")
            except Exception as erro:
                saida.write(f"[Erro ao ler o arquivo {caminho_relativo}: {erro}]\n")


# ==============================================================================
# FUNÇÃO PRINCIPAL DE EXPORTAÇÃO
# ==============================================================================

def exportar_codigos_separados() -> None:
    # Garante que a pasta de saída exista
    PASTA_SAIDA.mkdir(parents=True, exist_ok=True)

    # Coleta de arquivos por módulo
    arquivos_backend = coletar_arquivos_ordenados(DIRETORIOS_BACKEND, ARQUIVOS_BACKEND)
    arquivos_frontend = coletar_arquivos_ordenados(DIRETORIOS_FRONTEND, ARQUIVOS_FRONTEND)
    
    # Coleta completa (Backend + Frontend)
    diretorios_completos = DIRETORIOS_BACKEND + DIRETORIOS_FRONTEND
    arquivos_avulsos_completos = ARQUIVOS_BACKEND + ARQUIVOS_FRONTEND
    arquivos_completos = coletar_arquivos_ordenados(diretorios_completos, arquivos_avulsos_completos)

    # 1. Gerar arquivo completo (Backend + Frontend)
    caminho_completo = PASTA_SAIDA / NOME_ARQUIVO_COMPLETO
    gerar_arquivo_txt(
        caminho_saida=caminho_completo,
        titulo_modulo="COMPLETO (BACKEND + FRONTEND)",
        diretorios=diretorios_completos,
        arquivos_avulsos=arquivos_avulsos_completos,
        lista_arquivos=arquivos_completos
    )

    # 2. Gerar arquivo apenas BACKEND
    caminho_backend = PASTA_SAIDA / NOME_ARQUIVO_BACKEND
    gerar_arquivo_txt(
        caminho_saida=caminho_backend,
        titulo_modulo="BACKEND",
        diretorios=DIRETORIOS_BACKEND,
        arquivos_avulsos=ARQUIVOS_BACKEND,
        lista_arquivos=arquivos_backend
    )

    # 3. Gerar arquivo apenas FRONTEND / MOBILE
    caminho_frontend = PASTA_SAIDA / NOME_ARQUIVO_FRONTEND
    gerar_arquivo_txt(
        caminho_saida=caminho_frontend,
        titulo_modulo="FRONTEND / MOBILE",
        diretorios=DIRETORIOS_FRONTEND,
        arquivos_avulsos=ARQUIVOS_FRONTEND,
        lista_arquivos=arquivos_frontend
    )

    print("==================================================================")
    print("✅ Exportação concluída com sucesso! 3 arquivos foram gerados:")
    print(f" 1. Completo: {caminho_completo.resolve()} ({len(arquivos_completos)} arquivos)")
    print(f" 2. Backend:  {caminho_backend.resolve()} ({len(arquivos_backend)} arquivos)")
    print(f" 3. Frontend: {caminho_frontend.resolve()} ({len(arquivos_frontend)} arquivos)")
    print("==================================================================")


if __name__ == "__main__":
    exportar_codigos_separados()
