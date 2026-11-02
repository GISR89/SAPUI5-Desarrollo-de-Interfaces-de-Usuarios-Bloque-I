// Niveles permitidos
export type Level = "Beginner" | "Intermediate" | "Advanced";

// Forma tipada de un curso
export interface ICourse {
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  description: string;
}

// Evita que texto con <, >, & o comillas se interprete como HTML
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Escapa los caracteres con significado especial en expresiones regulares
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Devuelve el texto en HTML seguro, con las coincidencias dentro de <strong>
export function highlightText(text: string, term: string): string {
  const cleanTerm: string = term.trim();

  if (cleanTerm === "") {
    return escapeHtml(text);
  }

  // Los paréntesis de captura hacen que split conserve las coincidencias
  const regex = new RegExp(`(${escapeRegExp(cleanTerm)})`, "gi");

  return text
    .split(regex)
    .map((part: string, index: number): string =>
      index % 2 === 1 ? `<strong>${escapeHtml(part)}</strong>` : escapeHtml(part)
    )
    .join("");
}

export class Course implements ICourse {
  constructor(
    public title: string,
    public level: Level,
    public duration: number,
    public description: string
  ) {}
  
  render(highlight: string = ""): string {
    const levelClass = this.level.toLowerCase();

    return `
      <article class="course-card">
        <h2>${highlightText(this.title, highlight)}</h2>
        <p class="level">Nivel: <span class="badge ${levelClass}">${this.level}</span></p>
        <p class="duration">Duración: ${this.duration} horas</p>
        <p class="description">${this.description}</p>
      </article>
    `;
  }
}