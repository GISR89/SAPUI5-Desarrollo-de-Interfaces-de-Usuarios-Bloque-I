// Niveles permitidos
export type Level = "Beginner" | "Intermediate" | "Advanced";

// Forma tipada de un curso
export interface ICourse {
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  description: string;
}

export class Course implements ICourse {
  constructor(
    public title: string,
    public level: Level,
    public duration: number,
    public description: string
  ) {}
  
  render(): string {
    const levelClass = this.level.toLowerCase();

    return `
      <article class="course-card">
        <h2>${this.title}</h2>
        <p class="level">Nivel: <span class="badge ${levelClass}">${this.level}</span></p>
        <p class="duration">Duración: ${this.duration} horas</p>
        <p class="description">${this.description}</p>
      </article>
    `;
  }
}