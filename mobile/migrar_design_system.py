#!/usr/bin/env python3
r"""
PetRadar — migração conservadora de cores locais para o Design System.

Uso recomendado:

1) Simular sem alterar:
   python migrar_design_system.py --root "D:\PetRadar\src\mobile"

2) Aplicar:
   python migrar_design_system.py --root "D:\PetRadar\src\mobile" --apply

3) Aplicar criando .bak dos arquivos modificados:
   python migrar_design_system.py --root "D:\PetRadar\src\mobile" --apply --backup

O script:
- percorre mobile/src recursivamente;
- complementa src/theme/colors.ts com tokens já existentes visualmente no projeto;
- remove blocos `const COLORS = { ... };` quando todos os valores são reconhecidos;
- substitui `COLORS.x` diretamente por `theme.colors...`;
- adiciona o import de `theme` quando necessário;
- faz algumas substituições literais seguras e repetidas;
- NÃO altera arquivos com COLORS desconhecidos;
- gera relatório de cores literais restantes para revisão manual.
"""

from __future__ import annotations

import argparse
import os
import re
import shutil
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


TEXT_EXTENSIONS = {".ts", ".tsx"}

COLORS_BLOCK_RE = re.compile(
    r"(?P<indent>^[ \t]*)const\s+COLORS\s*=\s*\{(?P<body>.*?)^[ \t]*\};[ \t]*\n?",
    re.MULTILINE | re.DOTALL,
)

PROPERTY_RE = re.compile(
    r"^[ \t]*(?P<key>[A-Za-z_$][\w$]*)\s*:\s*(?P<value>.*?),"
    r"(?=[ \t]*(?://[^\n]*)?(?:\n|$))",
    re.MULTILINE | re.DOTALL,
)

THEME_IMPORT_RE = re.compile(
    r'import\s*\{[^}]*\btheme\b[^}]*\}\s*from\s*["\'][^"\']*theme/colors["\']\s*;',
    re.MULTILINE | re.DOTALL,
)

IMPORT_RE = re.compile(
    r"^import\b[\s\S]*?;[ \t]*(?:\n|$)",
    re.MULTILINE,
)

HARDCODED_COLOR_RE = re.compile(
    r"""(?P<quote>["'])
    (?P<color>
        \#[0-9A-Fa-f]{3,8}
        |
        rgba?\([^"']+\)
    )
    (?P=quote)""",
    re.VERBOSE,
)


@dataclass
class FileResult:
    path: Path
    changed: bool = False
    colors_blocks_removed: int = 0
    skipped_blocks: int = 0
    import_added: bool = False
    safe_literals_replaced: int = 0


def normalize_value(value: str) -> str:
    value = re.sub(r"\s+", "", value.strip())

    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        literal = value[1:-1]
        if literal.startswith(("rgb(", "rgba(")):
            return re.sub(r"\s+", "", literal)
        return literal.upper() if literal.startswith("#") else literal

    return value


VALUE_TO_THEME = {
    # Literais antigos
    "#1F5C4D": "theme.colors.brand",
    "#E8F5E9": "theme.colors.brandSoft",
    "#10B981": "theme.colors.accent",
    "#E6F4EA": "theme.colors.accentSoft",
    "#F4F7F6": "theme.colors.backgroundSoft",
    "#F5F6F8": "theme.colors.background",
    "#FFFFFF": "theme.colors.surface",
    "#FFF": "theme.colors.surface",
    "#1A1A1A": "theme.colors.textTitle",
    "#666666": "theme.colors.textBody",
    "#E2E8F0": "theme.colors.border",
    "#F0F0F0": "theme.colors.inputBg",
    "#A0AEC0": "theme.colors.placeholder",
    "#94A3B8": "theme.colors.muted",
    "#F8FAFC": "theme.colors.surfaceSoft",
    "#CBD5E1": "theme.colors.disabled",
    "#000000": "theme.colors.shadow",
    "#000": "theme.colors.shadow",

    "rgba(0,0,0,0.03)": "theme.colors.borderAlpha.card",
    "rgba(15,23,42,0.07)": "theme.colors.borderAlpha.default",
    "rgba(15,23,42,0.055)": "theme.colors.borderAlpha.subtle",
    "rgba(15,23,42,0.06)": "theme.colors.borderAlpha.faint",

    "rgba(31,92,77,0.065)": "theme.colors.brandAlpha.faint",
    "rgba(31,92,77,0.08)": "theme.colors.brandAlpha.soft",
    "rgba(31,92,77,0.10)": "theme.colors.brandAlpha.medium",
    "rgba(31,92,77,0.1)": "theme.colors.brandAlpha.medium",
    "rgba(31,92,77,0.14)": "theme.colors.brandAlpha.border",
    "rgba(31,92,77,0.20)": "theme.colors.brandAlpha.strongBorder",
    "rgba(31,92,77,0.2)": "theme.colors.brandAlpha.strongBorder",

    "rgba(15,23,42,0.028)": "theme.colors.mutedSurface",
    "rgba(15,23,42,0.56)": "theme.colors.overlay.modal",
    "rgba(15,23,42,0.58)": "theme.colors.overlay.modalStrong",
    "rgba(15,23,42,0.24)": "theme.colors.overlay.image",

    # Aliases que já apontam para o tema
    "theme.colors.brand": "theme.colors.brand",
    "theme.colors.action": "theme.colors.action",
    "theme.colors.background": "theme.colors.background",
    "theme.colors.backgroundSoft": "theme.colors.backgroundSoft",
    "theme.colors.surface": "theme.colors.surface",
    "theme.colors.surfaceSoft": "theme.colors.surfaceSoft",
    "theme.colors.textTitle": "theme.colors.textTitle",
    "theme.colors.textBody": "theme.colors.textBody",
    "theme.colors.inputBg": "theme.colors.inputBg",
    "theme.colors.border": "theme.colors.border",
    "theme.colors.placeholder": "theme.colors.placeholder",
    "theme.colors.muted": "theme.colors.muted",
    "theme.colors.semantic.danger.text": "theme.colors.semantic.danger.text",
    "theme.colors.semantic.danger.bg": "theme.colors.semantic.danger.bg",
    "theme.colors.semantic.warning.text": "theme.colors.semantic.warning.text",
    "theme.colors.semantic.warning.bg": "theme.colors.semantic.warning.bg",
    "theme.colors.semantic.success.text": "theme.colors.semantic.success.text",
    "theme.colors.semantic.success.bg": "theme.colors.semantic.success.bg",
    "theme.colors.overlay.modal": "theme.colors.overlay.modal",
    "theme.colors.overlay.modalStrong": "theme.colors.overlay.modalStrong",
    "theme.colors.overlay.image": "theme.colors.overlay.image",
    "theme.colors.borderAlpha.default": "theme.colors.borderAlpha.default",
    "theme.colors.borderAlpha.subtle": "theme.colors.borderAlpha.subtle",
    "theme.colors.borderAlpha.faint": "theme.colors.borderAlpha.faint",
    "theme.colors.brandAlpha.faint": "theme.colors.brandAlpha.faint",
    "theme.colors.brandAlpha.border": "theme.colors.brandAlpha.border",
    "theme.colors.mutedSurface": "theme.colors.mutedSurface",
}


def find_mobile_root(root: Path) -> Path:
    root = root.resolve()

    if (root / "src" / "theme" / "colors.ts").exists():
        return root

    if (root / "mobile" / "src" / "theme" / "colors.ts").exists():
        return root / "mobile"

    raise FileNotFoundError(
        "Não encontrei src/theme/colors.ts. "
        "Informe --root apontando para D:\\PetRadar\\src\\mobile "
        "ou para D:\\PetRadar\\src."
    )


def ensure_after(text: str, anchor_pattern: str, insertion: str, token_marker: str) -> str:
    if token_marker in text:
        return text

    match = re.search(anchor_pattern, text, re.MULTILINE)
    if not match:
        raise RuntimeError(f"Não encontrei âncora para inserir {token_marker}")

    return text[: match.end()] + insertion + text[match.end() :]


def update_theme_file(text: str) -> str:
    """
    Complementa o theme existente sem substituir o objeto inteiro.
    Mantém tokens e comentários já presentes.
    """
    original = text

    text = ensure_after(
        text,
        r"^[ \t]*brand:\s*['\"]#1F5C4D['\"],[^\n]*\n",
        '    brandSoft: "#E8F5E9",\n\n'
        '    accent: "#10B981",\n'
        '    accentSoft: "#E6F4EA",\n',
        "brandSoft:",
    )

    text = ensure_after(
        text,
        r"^[ \t]*background:\s*['\"]#F5F6F8['\"],[^\n]*\n",
        '    backgroundSoft: "#F4F7F6",\n',
        "backgroundSoft:",
    )

    text = ensure_after(
        text,
        r"^[ \t]*surface:\s*['\"]#FFFFFF['\"],[^\n]*\n",
        '    surfaceSoft: "#F8FAFC",\n',
        "surfaceSoft:",
    )

    text = ensure_after(
        text,
        r"^[ \t]*textBody:\s*['\"]#666666['\"],[^\n]*\n",
        '    muted: "#94A3B8",\n'
        '    placeholder: "#A0AEC0",\n',
        "placeholder:",
    )

    ui_block = (
        '    border: "#E2E8F0",\n'
        '    disabled: "#CBD5E1",\n'
        '    shadow: "#000000",\n\n'
        '    borderAlpha: {\n'
        '      card: "rgba(0, 0, 0, 0.03)",\n'
        '      default: "rgba(15, 23, 42, 0.07)",\n'
        '      subtle: "rgba(15, 23, 42, 0.055)",\n'
        '      faint: "rgba(15, 23, 42, 0.06)",\n'
        '    },\n\n'
        '    brandAlpha: {\n'
        '      faint: "rgba(31, 92, 77, 0.065)",\n'
        '      soft: "rgba(31, 92, 77, 0.08)",\n'
        '      medium: "rgba(31, 92, 77, 0.10)",\n'
        '      border: "rgba(31, 92, 77, 0.14)",\n'
        '      strongBorder: "rgba(31, 92, 77, 0.20)",\n'
        '    },\n\n'
        '    overlay: {\n'
        '      modal: "rgba(15, 23, 42, 0.56)",\n'
        '      modalStrong: "rgba(15, 23, 42, 0.58)",\n'
        '      image: "rgba(15, 23, 42, 0.24)",\n'
        '    },\n\n'
        '    mutedSurface: "rgba(15, 23, 42, 0.028)",\n'
    )

    if "borderAlpha:" not in text:
        text = ensure_after(
            text,
            r"^[ \t]*inputBg:\s*['\"]#F0F0F0['\"],[^\n]*\n",
            ui_block,
            "borderAlpha:",
        )

    return text if text != original else original


def theme_import_path(file_path: Path, src_root: Path) -> str:
    theme_without_suffix = src_root / "theme" / "colors"
    relative = os.path.relpath(theme_without_suffix, file_path.parent).replace("\\", "/")

    if not relative.startswith("."):
        relative = "./" + relative

    return relative


def ensure_theme_import(text: str, file_path: Path, src_root: Path) -> tuple[str, bool]:
    if "theme." not in text:
        return text, False

    if THEME_IMPORT_RE.search(text):
        return text, False

    import_path = theme_import_path(file_path, src_root)
    import_line = f'import {{ theme }} from "{import_path}";\n'

    imports = list(IMPORT_RE.finditer(text))

    if imports:
        pos = imports[-1].end()
        return text[:pos] + "\n" + import_line + text[pos:], True

    return import_line + "\n" + text, True


def parse_colors_body(body: str) -> dict[str, str]:
    result: dict[str, str] = {}

    for match in PROPERTY_RE.finditer(body):
        key = match.group("key")
        value = normalize_value(match.group("value"))
        result[key] = value

    return result


def migrate_colors_blocks(text: str) -> tuple[str, int, int, list[str]]:
    """
    Remove um bloco COLORS apenas se TODOS os campos forem reconhecidos.
    """
    removed = 0
    skipped = 0
    warnings: list[str] = []

    while True:
        match = COLORS_BLOCK_RE.search(text)
        if not match:
            break

        body = match.group("body")
        properties = parse_colors_body(body)

        if not properties:
            skipped += 1
            warnings.append("Bloco COLORS encontrado, mas nenhuma propriedade pôde ser interpretada.")
            # Evita loop no mesmo bloco: marca temporariamente apenas durante a execução.
            text = text[:match.start()] + text[match.start():match.end()].replace(
                "const COLORS", "const __COLORS_SKIPPED__", 1
            ) + text[match.end():]
            continue

        unknown = {
            key: value
            for key, value in properties.items()
            if value not in VALUE_TO_THEME
        }

        if unknown:
            skipped += 1
            details = ", ".join(f"{k}={v}" for k, v in unknown.items())
            warnings.append(f"Bloco COLORS não alterado por valores desconhecidos: {details}")
            text = text[:match.start()] + text[match.start():match.end()].replace(
                "const COLORS", "const __COLORS_SKIPPED__", 1
            ) + text[match.end():]
            continue

        replacements = {
            key: VALUE_TO_THEME[value]
            for key, value in properties.items()
        }

        candidate = text[:match.start()] + text[match.end():]

        for key, replacement in replacements.items():
            candidate = re.sub(
                rf"\bCOLORS\.{re.escape(key)}\b",
                replacement,
                candidate,
            )

        # Segurança: se ainda restou COLORS.* referente ao bloco removido,
        # cancela a remoção.
        if re.search(r"\bCOLORS\.", candidate):
            known_keys = set(replacements)
            remaining_keys = set(
                re.findall(r"\bCOLORS\.([A-Za-z_$][\w$]*)", candidate)
            )
            if remaining_keys - known_keys:
                skipped += 1
                warnings.append(
                    "Bloco COLORS não removido porque há referências não mapeadas: "
                    + ", ".join(sorted(remaining_keys - known_keys))
                )
                text = text[:match.start()] + text[match.start():match.end()].replace(
                    "const COLORS", "const __COLORS_SKIPPED__", 1
                ) + text[match.end():]
                continue

        text = candidate
        removed += 1

    # Restaura blocos pulados.
    text = text.replace("const __COLORS_SKIPPED__", "const COLORS")

    return text, removed, skipped, warnings


SAFE_STYLE_LITERAL_MAP = {
    "#FFFFFF": "theme.colors.surface",
    "#FFF": "theme.colors.surface",
    "#000000": "theme.colors.shadow",
    "#000": "theme.colors.shadow",
    "#A0AEC0": "theme.colors.placeholder",
    "#94A3B8": "theme.colors.muted",
    "#F8FAFC": "theme.colors.surfaceSoft",
    "#CBD5E1": "theme.colors.disabled",
    "#E2E8F0": "theme.colors.border",
    "#E8F5E9": "theme.colors.brandSoft",
    "#E6F4EA": "theme.colors.accentSoft",
    "#10B981": "theme.colors.accent",
    "#F4F7F6": "theme.colors.backgroundSoft",
    "#F5F6F8": "theme.colors.background",
    "#1F5C4D": "theme.colors.brand",
    "#1A1A1A": "theme.colors.textTitle",
    "#666666": "theme.colors.textBody",
    "rgba(0,0,0,0.03)": "theme.colors.borderAlpha.card",
    "rgba(15,23,42,0.07)": "theme.colors.borderAlpha.default",
    "rgba(15,23,42,0.055)": "theme.colors.borderAlpha.subtle",
    "rgba(15,23,42,0.06)": "theme.colors.borderAlpha.faint",
    "rgba(31,92,77,0.065)": "theme.colors.brandAlpha.faint",
    "rgba(31,92,77,0.14)": "theme.colors.brandAlpha.border",
    "rgba(15,23,42,0.028)": "theme.colors.mutedSurface",
    "rgba(15,23,42,0.56)": "theme.colors.overlay.modal",
    "rgba(15,23,42,0.58)": "theme.colors.overlay.modalStrong",
    "rgba(15,23,42,0.24)": "theme.colors.overlay.image",
}


def normalize_color_literal(color: str) -> str:
    color = color.strip()
    if color.startswith("#"):
        return color.upper()
    return re.sub(r"\s+", "", color)


def replace_safe_style_literals(text: str) -> tuple[str, int]:
    """
    Substitui somente contextos sintáticos simples e seguros:
    - propriedade JSX: color="#..."
    - propriedades de objeto/StyleSheet: foo: "#..."
    - trackColor false/true com literal conhecido

    Não troca strings arbitrárias.
    """
    count = 0

    # JSX color="#..."
    jsx_re = re.compile(
        r'(?P<prefix>\b(?:color|placeholderTextColor|tintColor)\s*=\s*)'
        r'(?P<q>["\'])(?P<value>#[0-9A-Fa-f]{3,8}|rgba?\([^"\']+\))(?P=q)'
    )

    def jsx_sub(match: re.Match[str]) -> str:
        nonlocal count
        key = normalize_color_literal(match.group("value"))
        replacement = SAFE_STYLE_LITERAL_MAP.get(key)
        if not replacement:
            return match.group(0)
        count += 1
        return f'{match.group("prefix")}{{{replacement}}}'

    text = jsx_re.sub(jsx_sub, text)

    # Objeto/StyleSheet: chave: "cor"
    object_re = re.compile(
        r'(?P<prefix>\b[A-Za-z_$][\w$]*\s*:\s*)'
        r'(?P<q>["\'])(?P<value>#[0-9A-Fa-f]{3,8}|rgba?\([^"\']+\))(?P=q)'
    )

    def object_sub(match: re.Match[str]) -> str:
        nonlocal count
        key = normalize_color_literal(match.group("value"))
        replacement = SAFE_STYLE_LITERAL_MAP.get(key)
        if not replacement:
            return match.group(0)
        count += 1
        return f'{match.group("prefix")}{replacement}'

    text = object_re.sub(object_sub, text)

    return text, count


def remaining_hardcoded_colors(text: str) -> list[str]:
    colors = []
    for match in HARDCODED_COLOR_RE.finditer(text):
        colors.append(match.group("color"))
    return colors


def iter_source_files(src_root: Path) -> Iterable[Path]:
    for path in src_root.rglob("*"):
        if (
            path.is_file()
            and path.suffix.lower() in TEXT_EXTENSIONS
            and "node_modules" not in path.parts
        ):
            yield path


def process_file(
    path: Path,
    src_root: Path,
    theme_file: Path,
) -> tuple[str, FileResult, list[str]]:
    original = path.read_text(encoding="utf-8")
    text = original
    result = FileResult(path=path)
    warnings: list[str] = []

    if path == theme_file:
        text = update_theme_file(text)
    else:
        text, removed, skipped, block_warnings = migrate_colors_blocks(text)
        result.colors_blocks_removed = removed
        result.skipped_blocks = skipped
        warnings.extend(block_warnings)

        text, literal_count = replace_safe_style_literals(text)
        result.safe_literals_replaced = literal_count

        text, imported = ensure_theme_import(text, path, src_root)
        result.import_added = imported

    result.changed = text != original
    return text, result, warnings


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Migra cores locais do PetRadar para src/theme/colors.ts."
    )
    parser.add_argument(
        "--root",
        required=True,
        help=r'Raiz do mobile. Ex.: "D:\PetRadar\src\mobile"',
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Aplica alterações. Sem esta flag, apenas simula.",
    )
    parser.add_argument(
        "--backup",
        action="store_true",
        help="Com --apply, cria arquivo .bak antes de sobrescrever.",
    )
    parser.add_argument(
        "--fail-on-skipped",
        action="store_true",
        help="Retorna código 2 se algum bloco COLORS não puder ser migrado.",
    )
    args = parser.parse_args()

    try:
        mobile_root = find_mobile_root(Path(args.root))
    except Exception as exc:
        print(f"[ERRO] {exc}")
        return 1

    src_root = mobile_root / "src"
    theme_file = src_root / "theme" / "colors.ts"

    print("=" * 72)
    print("PetRadar — migração Design System")
    print("=" * 72)
    print(f"Mobile: {mobile_root}")
    print(f"Modo:   {'APLICAR' if args.apply else 'SIMULAÇÃO'}")
    print()

    results: list[FileResult] = []
    all_warnings: list[tuple[Path, str]] = []
    pending_writes: list[tuple[Path, str]] = []

    # Theme primeiro.
    ordered_files = [theme_file] + [
        p for p in iter_source_files(src_root)
        if p != theme_file
    ]

    for path in ordered_files:
        try:
            new_text, result, warnings = process_file(
                path=path,
                src_root=src_root,
                theme_file=theme_file,
            )
        except Exception as exc:
            print(f"[ERRO] {path.relative_to(mobile_root)}: {exc}")
            return 1

        results.append(result)

        for warning in warnings:
            all_warnings.append((path, warning))

        if result.changed:
            pending_writes.append((path, new_text))

    for result in results:
        if not result.changed and not result.skipped_blocks:
            continue

        rel = result.path.relative_to(mobile_root)

        details = []
        if result.colors_blocks_removed:
            details.append(f"COLORS removidos={result.colors_blocks_removed}")
        if result.safe_literals_replaced:
            details.append(f"literais seguros={result.safe_literals_replaced}")
        if result.import_added:
            details.append("import theme adicionado")
        if result.skipped_blocks:
            details.append(f"COLORS ignorados={result.skipped_blocks}")

        status = "ALTERAR" if result.changed else "REVISAR"
        print(f"[{status}] {rel}")
        if details:
            print("          " + " | ".join(details))

    if args.apply:
        print()
        print("Aplicando alterações...")

        for path, new_text in pending_writes:
            if args.backup:
                backup_path = path.with_suffix(path.suffix + ".bak")
                shutil.copy2(path, backup_path)

            path.write_text(new_text, encoding="utf-8", newline="\n")

        print(f"Arquivos alterados: {len(pending_writes)}")
    else:
        print()
        print(f"Arquivos que seriam alterados: {len(pending_writes)}")
        print("Nenhum arquivo foi escrito. Use --apply para aplicar.")

    print()
    print("-" * 72)
    print("Avisos")
    print("-" * 72)

    if not all_warnings:
        print("Nenhum bloco COLORS desconhecido encontrado.")
    else:
        for path, warning in all_warnings:
            print(f"- {path.relative_to(mobile_root)}: {warning}")

    print()
    print("-" * 72)
    print("Cores literais restantes após a transformação calculada")
    print("-" * 72)

    remaining_by_file: dict[Path, list[str]] = {}

    # Analisa o conteúdo transformado em memória (mesmo no dry-run).
    transformed_map = {path: text for path, text in pending_writes}

    for path in ordered_files:
        if path == theme_file:
            continue

        text = transformed_map.get(path)
        if text is None:
            text = path.read_text(encoding="utf-8")

        colors = remaining_hardcoded_colors(text)

        # Remove duplicados preservando ordem.
        unique = list(dict.fromkeys(colors))

        if unique:
            remaining_by_file[path] = unique

    if not remaining_by_file:
        print("Nenhuma cor literal restante fora do theme.")
    else:
        for path, colors in remaining_by_file.items():
            rel = path.relative_to(mobile_root)
            print(f"- {rel}")
            for color in colors[:20]:
                print(f"    {color}")
            if len(colors) > 20:
                print(f"    ... +{len(colors) - 20} outras")

    print()
    print("=" * 72)
    print("Próxima verificação recomendada")
    print("=" * 72)
    print(r'cd "{}"'.format(mobile_root))
    print("npx tsc --noEmit")
    print("git diff -- src")
    print("git status --short")

    skipped_total = sum(r.skipped_blocks for r in results)

    if args.fail_on_skipped and skipped_total:
        return 2

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
