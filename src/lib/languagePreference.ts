import type { Language, Localized } from "@/domain/language";
import { homePath, projectsPath } from "@/lib/routes";

export const LANGUAGE_STORAGE_KEY = "lang";

/** Tipo da transição de navegação ao trocar de idioma; a animação fica em globals.css. */
export const LANGUAGE_TRANSITION = "language";

export function rememberLanguage(language: Language): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    return;
  }
}

const EN_ROOT = homePath("en").replace(/\/$/, "");
const PT_PROJECTS = projectsPath("pt").replace(/\/$/, "");
const EN_PROJECTS = projectsPath("en").replace(/\/$/, "");

export function pathLanguage(pathname: string): Language {
  return pathname === EN_ROOT || pathname.startsWith(`${EN_ROOT}/`) ? "en" : "pt";
}

/**
 * Roda antes da primeira pintura, no topo do <body>: ajusta o lang do <html> conforme a rota e,
 * nas páginas em português, manda quem chega com o navegador em outro idioma para a página
 * equivalente em inglês sem ver o conteúdo em português piscar. O redirecionamento só age na
 * primeira visita — depois disso a escolha guardada manda.
 */
export function languageBootScript(htmlLang: Localized<string>): string {
  return `(function(){try{
var p=location.pathname,r=${JSON.stringify(EN_ROOT)},en=p===r||p.indexOf(r+"/")===0;
document.documentElement.lang=en?${JSON.stringify(htmlLang.en)}:${JSON.stringify(htmlLang.pt)};
if(en)return;
var k=${JSON.stringify(LANGUAGE_STORAGE_KEY)};
if(localStorage.getItem(k))return;
var l=(navigator.language||"").toLowerCase().indexOf("pt")===0?"pt":"en";
localStorage.setItem(k,l);
if(l!=="en")return;
location.replace(p.indexOf(${JSON.stringify(PT_PROJECTS)})===0?${JSON.stringify(EN_PROJECTS)}+p.slice(${PT_PROJECTS.length}):r+p);
}catch(e){}})();`;
}
