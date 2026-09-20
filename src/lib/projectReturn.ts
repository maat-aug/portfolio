const KEY = "skip-projects-enter-animation";

/** Marca que a próxima visita à lista de projetos veio de um "voltar", e não de uma navegação nova. */
export function markProjectReturn(): void {
  try {
    sessionStorage.setItem(KEY, "true");
  } catch {
    return;
  }
}

/** Lê e limpa a marca. Retorna false quando o storage está bloqueado (Safari privado, por exemplo). */
export function consumeProjectReturn(): boolean {
  try {
    if (sessionStorage.getItem(KEY) !== "true") return false;
    sessionStorage.removeItem(KEY);
    return true;
  } catch {
    return false;
  }
}
