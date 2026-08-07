import os
from pathlib import Path
from typing import List, Set

# Caminho base do repositório
RAIZ_PROJETO = Path(
    r"D:\Pesquisa Pucminas\Pesquisa de animais errantes\PetRadar\pmv-ads-2026-1-e2-proj-int-t6-pmv-ads-2026-1-e2-proj-int-t6-IntApplicationProject-Template-8827313f65d1bdbbcd7921e29482da59512116ae"
)

# 1. Diretórios para varredura recursiva (inclui subpastas)
DIRETORIOS_ALVO: List[Path] = [
    RAIZ_PROJETO / "src" / "backend" / "app",
    RAIZ_PROJETO / "src" / "backend" / "alembic",
    RAIZ_PROJETO / "src" / "mobile",
]

# 2. Arquivos de configuração específicos (fora das subpastas acima)
ARQUIVOS_AVULSOS: List[Path] = [
    RAIZ_PROJETO / "src" / "backend" / "docker-compose.yml",
    RAIZ_PROJETO / "src" / "backend" / "alembic.ini",
    RAIZ_PROJETO / "src" / "backend" / ".env",
    RAIZ_PROJETO / "src" / "backend" / "alembic" / "env.py",
    RAIZ_PROJETO / "src" / "mobile" / "package.json",
]

ARQUIVO_SAIDA = "codigo_projeto_consolidado.txt"

# Pastas ignoradas na varredura
PASTAS_IGNORADAS: Set[str] = {
    ".git", ".venv", "venv", "__pycache__", "node_modules",
    ".expo", "android", "ios", "assets", ".vscode", ".idea", "build", "dist"
}

# Arquivos ignorados (travas de pacotes, etc)
ARQUIVOS_IGNORADOS: Set[str] = {
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb", ARQUIVO_SAIDA
}

# Extensões permitidas para leitura
EXTENSOES_RELEVANTES: Set[str] = {
    ".py", ".ts", ".tsx", ".js", ".jsx", ".json", ".sql",
    ".ini", ".yml", ".yaml", ".md", ".mako"
}

# Nomes exatos permitidos (garante leitura mesmo de arquivos como .env)
NOMES_PERMITIDOS: Set[str] = {
    ".env", ".env.example", "docker-compose.yml", "alembic.ini", "package.json", "env.py"
}

TAMANHO_MAXIMO_KB = 500


def eh_arquivo_valido(caminho: Path) -> bool:
    """Valida se o arquivo atende aos critérios de leitura."""
    if not caminho.is_file():
        return False
    if any(part in PASTAS_IGNORADAS for part in caminho.parts):
        return False
    if caminho.name in ARQUIVOS_IGNORADOS:
        return False
    if caminho.stat().st_size > (TAMANHO_MAXIMO_KB * 1024):
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
            if item.name not in PASTAS_IGNORADAS
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


def exportar_codigo_consolidado() -> None:
    caminho_saida = Path(__file__).parent / ARQUIVO_SAIDA
    arquivos_processados = set()

    with open(caminho_saida, "w", encoding="utf-8") as saida:
        # -------------------------------------------------------------
        # PARTE 1: Mapeamento de Estrutura
        # -------------------------------------------------------------
        saida.write("=" * 80 + "\n")
        saida.write("ARQUITETURA DO PROJETO (ESTRUTURA DE DIRETÓRIOS E ARQUIVOS)\n")
        saida.write("=" * 80 + "\n\n")

        for diretorio in DIRETORIOS_ALVO:
            if diretorio.exists():
                saida.write(f"📁 {diretorio.relative_to(RAIZ_PROJETO)}\n")
                saida.write(gerar_arvore_diretorios(diretorio) + "\n\n")

        saida.write("📄 ARQUIVOS DE CONFIGURAÇÃO DE RAIZ ADICIONADOS:\n")
        for arq in ARQUIVOS_AVULSOS:
            if arq.exists():
                saida.write(f"  └── {arq.relative_to(RAIZ_PROJETO)}\n")
        saida.write("\n")

        # -------------------------------------------------------------
        # PARTE 2: Leitura dos Conteúdos
        # -------------------------------------------------------------
        saida.write("=" * 80 + "\n")
        saida.write("CÓDIGO-FONTE E SCRIPTS DE CONFIGURAÇÃO\n")
        saida.write("=" * 80 + "\n\n")

        def gravar_conteudo(caminho: Path):
            caminho_abs = caminho.resolve()
            if caminho_abs in arquivos_processados:
                return
            arquivos_processados.add(caminho_abs)

            caminho_relativo = caminho.relative_to(RAIZ_PROJETO)

            saida.write(f"\n{'=' * 80}\n")
            saida.write(f"CAMINHO: {caminho_relativo}\n")
            saida.write(f"{'=' * 80}\n\n")

            try:
                conteudo = caminho.read_text(encoding="utf-8", errors="ignore")
                saida.write(conteudo + "\n")
            except Exception as erro:
                saida.write(f"[Erro ao ler o arquivo: {erro}]\n")

        # 2.1 Varredura das pastas selecionadas
        for diretorio in DIRETORIOS_ALVO:
            if not diretorio.exists():
                continue

            for caminho in diretorio.rglob("*"):
                if eh_arquivo_valido(caminho):
                    gravar_conteudo(caminho)

        # 2.2 Leitura dos arquivos avulsos especificados
        for arq in ARQUIVOS_AVULSOS:
            if arq.exists() and eh_arquivo_valido(arq):
                gravar_conteudo(arq)

    print(f"Exportação concluída! Arquivo salvo em: {caminho_saida}")


if __name__ == "__main__":
    exportar_codigo_consolidado()