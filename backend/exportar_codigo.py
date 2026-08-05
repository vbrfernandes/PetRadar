import os

# Nome do arquivo TXT que será gerado
ARQUIVO_SAIDA = "codigo_projeto_completo.txt"

# Pastas que serão IGNORADAS na varredura
PASTAS_IGNORADAS = {
    ".git",
    "__pycache__",
    "venv",
    ".venv",
    "node_modules",
    ".vscode",
    ".idea",
    "postgres_data",
    ".pytest_cache",
    "build",
    "dist"
}

# Extensões de arquivos binários/mídia que NÃO devem ser lidas
EXTENSOES_IGNORADAS = {
    ".exe", ".pyc", ".png", ".jpg", ".jpeg", ".gif", 
    ".ico", ".zip", ".tar", ".gz", ".pdf", ".sqlite3", ".db"
}

def exportar_codigo(diretorio_raiz="."):
    with open(ARQUIVO_SAIDA, "w", encoding="utf-8") as saida:
        for raiz, diretorios, arquivos in os.walk(diretorio_raiz):
            # Filtra e remove pastas ignoradas da busca
            diretorios[:] = [d for d in diretorios if d not in PASTAS_IGNORADAS]
            
            for nome_arquivo in arquivos:
                extensao = os.path.splitext(nome_arquivo)[1].lower()
                
                # Ignora binários e o próprio arquivo gerado
                if extensao in EXTENSOES_IGNORADAS or nome_arquivo == ARQUIVO_SAIDA:
                    continue
                
                caminho_completo = os.path.join(raiz, nome_arquivo)
                caminho_relativo = os.path.relpath(caminho_completo, diretorio_raiz)
                
                # Escreve o cabeçalho com o caminho do arquivo
                saida.write(f"\n{'='*80}\n")
                saida.write(f"CAMINHO: {caminho_relativo}\n")
                saida.write(f"{'='*80}\n\n")
                
                # Tenta ler o conteúdo e gravar no TXT
                try:
                    with open(caminho_completo, "r", encoding="utf-8", errors="ignore") as f:
                        conteudo = f.read()
                        saida.write(conteudo)
                        saida.write("\n")
                except Exception as erro:
                    saida.write(f"[Erro ao ler o arquivo: {erro}]\n")

    print(f"Exportação concluída! Arquivo salvo em: {os.path.abspath(ARQUIVO_SAIDA)}")

if __name__ == "__main__":
    exportar_codigo()
    