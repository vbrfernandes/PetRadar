import os
from pathlib import Path
from typing import Set

# Caminho do projeto React Native / Expo
DIRETORIO_ALVO = Path(
    r"D:\Pesquisa Pucminas\Pesquisa de animais errantes\PetRadar\pmv-ads-2026-1-e2-proj-int-t6-pmv-ads-2026-1-e2-proj-int-t6-IntApplicationProject-Template-8827313f65d1bdbbcd7921e29482da59512116ae\src\mobile"
)

ARQUIVO_SAIDA = "codigo_frontend_completo.txt"

# 1. Ignorar pastas de build, dependências e artefatos
PASTAS_IGNORADAS: Set[str] = {
    "node_modules", ".expo", "android", "ios", "assets",
    ".git", ".vscode", ".idea", "build", "dist", ".bundle"
}

# 2. Ignorar trava de dependências e binários pesados (Poluição Visual/Contexto)
ARQUIVOS_IGNORADOS: Set[str] = {
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb",
    ARQUIVO_SAIDA, "exportar_frontend.py"
}

# 3. Whitelist: Apenas extensões cruciais para arquitetura e manutenção
EXTENSOES_RELEVANTES: Set[str] = {
    ".ts", ".tsx", ".js", ".jsx", ".json", ".env.example", ".md"
}

TAMANHO_MAXIMO_KB = 500  # Evita estourar memória lendo arquivos gigantes acidentais


def gerar_arvore_diretorios(diretorio: Path, prefixo: str = "") -> str:
    """Gera visualização hierárquica do projeto para mapeamento rápido de arquitetura."""
    linhas = []
    itens = sorted(
        [
            item for item in diretorio.iterdir()
            if item.name not in PASTAS_IGNORADAS and not item.name.startswith(".")
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


def exportar_codigo(diretorio_raiz: Path) -> None:
    caminho_saida = Path(__file__).parent / ARQUIVO_SAIDA

    if not diretorio_raiz.exists():
        print(f"[Erro] Diretório não encontrado: {diretorio_raiz}")
        return

    with open(caminho_saida, "w", encoding="utf-8") as saida:
        # Cabeçalho 1: Árvore do Projeto (Essencial para IA/Code Review entender a estrutura)
        saida.write("=" * 80 + "\n")
        saida.write("ARQUITETURA DO PROJETO (MAPA DE DIRETÓRIOS)\n")
        saida.write("=" * 80 + "\n\n")
        saida.write(f"{diretorio_raiz.name}/\n")
        saida.write(gerar_arvore_diretorios(diretorio_raiz) + "\n\n")

        # Cabeçalho 2: Conteúdo dos Arquivos de Código
        saida.write("=" * 80 + "\n")
        saida.write("CÓDIGO FONTE E CONFIGURAÇÕES DE MANUTENÇÃO\n")
        saida.write("=" * 80 + "\n\n")

        for caminho in diretorio_raiz.rglob("*"):
            # Validações de exclusão
            if caminho.is_dir():
                continue
            if any(part in PASTAS_IGNORADAS for part in caminho.parts):
                continue
            if caminho.name in ARQUIVOS_IGNORADOS:
                continue
            if caminho.suffix.lower() not in EXTENSOES_RELEVANTES:
                continue
            if caminho.stat().st_size > (TAMANHO_MAXIMO_KB * 1024):
                continue

            caminho_relativo = caminho.relative_to(diretorio_raiz)

            saida.write(f"\n{'=' * 80}\n")
            saida.write(f"CAMINHO: {caminho_relativo}\n")
            saida.write(f"{'=' * 80}\n\n")

            try:
                conteudo = caminho.read_text(encoding="utf-8", errors="ignore")
                saida.write(conteudo + "\n")
            except Exception as erro:
                saida.write(f"[Erro ao ler o arquivo: {erro}]\n")

    print(f"Exportação concluída! Arquivo consolidado salvo em: {caminho_saida}")


if __name__ == "__main__":
    exportar_codigo(DIRETORIO_ALVO)