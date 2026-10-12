function chave(idUsuario: number): string {
  return `barbearia-selecionada-${idUsuario}`
}

export function lerBarbeariaSelecionada(idUsuario: number): number | null {
  try {
    const valor = window.sessionStorage.getItem(chave(idUsuario))
    if (valor === null) return null
    const id = Number(valor)
    return Number.isSafeInteger(id) && id > 0 ? id : null
  } catch {
    return null
  }
}

export function salvarBarbeariaSelecionada(idUsuario: number, id: number): void {
  try {
    window.sessionStorage.setItem(chave(idUsuario), String(id))
  } catch {
    // Navegacao permanece disponivel sem armazenamento do navegador.
  }
}
