import type { Language } from "@/domain/language";
import { projectsPath } from "@/lib/routes";

export const LANGUAGE_STORAGE_KEY = "lang";

export function rememberLanguage(language: Language): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    return;
  }
}

const PT_PROJECTS = projectsPath("pt").replace(/\/$/, "");
const EN_PROJECTS = projectsPath("en").replace(/\/$/, "");

/**
 * Roda antes da primeira pintura, no topo do <body> das páginas em português: quem chega com o
 * navegador em outro idioma vai para a página equivalente em inglês sem ver o conteúdo em
 * português piscar. Só age na primeira visita — depois disso a escolha guardada manda.
 */
export const LANGUAGE_REDIRECT_SCRIPT = `(function(){try{
var k=${JSON.stringify(LANGUAGE_STORAGE_KEY)};
if(localStorage.getItem(k))return;
var l=(navigator.language||"").toLowerCase().indexOf("pt")===0?"pt":"en";
localStorage.setItem(k,l);
if(l!=="en")return;
var p=location.pathname;
location.replace(p.indexOf(${JSON.stringify(PT_PROJECTS)})===0?${JSON.stringify(EN_PROJECTS)}+p.slice(${PT_PROJECTS.length}):"/en"+p);
}catch(e){}})();`;
