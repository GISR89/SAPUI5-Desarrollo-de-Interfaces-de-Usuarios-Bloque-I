import { Course, type ICourse, type Level } from "./models/course.js";

let courses: Course[] = [];

// ---------------------------------------------------------------
// loadCourses
// PARÁMETROS: ninguno
// RETORNO: Promise<ICourse[]> -> una promesa que, al resolverse,
//          entrega un array de cursos (es async, siempre devuelve promesa)
// ---------------------------------------------------------------
async function loadCourses(): Promise<ICourse[]> {
  const response: Response = await fetch("courses.json");

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  return response.json();
}



// ---------------------------------------------------------------
// renderCatalog
// PARÁMETRO: list: Course[] -> el array de cursos que se va a pintar
// RETORNO: void -> no devuelve nada, solo modifica la página
// ---------------------------------------------------------------
// highlight: texto buscado que se resaltará en los títulos (opcional)
function renderCatalog(list: Course[], highlight: string = ""): void {
  try {
    const catalog: HTMLElement | null = document.getElementById("catalog");

    if (!catalog) {
      throw new Error("Catalog container not found");
    }

    catalog.innerHTML = "";

    if (list.length === 0) {
      catalog.innerHTML = '<p class="empty-message">No courses match your search.</p>';
      return;
    }

    // PARÁMETRO de la flecha: course: Course -> cada curso del array
    // RETORNO de la flecha: void -> no devuelve nada
    list.forEach((course: Course): void => {
      catalog.innerHTML += course.render(highlight);
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error rendering catalog:", message);
  }
}

// ---------------------------------------------------------------
// filterCourses
// PARÁMETROS:
//   list: Course[]          -> cursos entre los que se busca
//   level: Level | "All"    -> nivel elegido ("All" acepta todos)
//   searchText: string      -> texto escrito en el buscador
// RETORNO: Course[] -> solo los cursos que cumplen ambos filtros
// ---------------------------------------------------------------
function filterCourses(
  list: Course[],
  level: Level | "All",
  searchText: string
): Course[] {
  const text: string = searchText.trim().toLowerCase();

  // PARÁMETRO de la flecha: course: Course -> cada curso evaluado
  // RETORNO de la flecha: boolean -> true si el curso se queda en la lista
  return list.filter((course: Course): boolean => {
    const matchesLevel: boolean = level === "All" || course.level === level;
    const matchesText: boolean = course.title.toLowerCase().includes(text);

    return matchesLevel && matchesText;
  });
}

// Referencias al DOM con aserciones de tipo
const searchInput = document.getElementById("search") as HTMLInputElement;
const levelSelect = document.getElementById("level-filter") as HTMLSelectElement;
const catalogContainer = document.getElementById("catalog") as HTMLDivElement;

// Manejador de eventos tipado
function applyFilters(): void {
  const filtered: Course[] = filterCourses(
    courses,
    levelSelect.value as Level | "All",
    searchInput.value
  );
  renderCatalog(filtered, searchInput.value);
}

// Registro de manejadores
levelSelect.addEventListener("change", (event: Event): void => {
  applyFilters();
});

searchInput.addEventListener("input", (event: Event): void => {
  applyFilters();
});

// ---------------------------------------------------------------
// init
// PARÁMETROS: ninguno
// RETORNO: Promise<void> -> promesa sin valor (es async, pero no
//          devuelve datos, solo carga y pinta)
// ---------------------------------------------------------------
async function init(): Promise<void> {
  const catalog = document.getElementById("catalog") as HTMLElement;
  catalog.innerHTML = '<p class="loading">Loading courses...</p>';

  try {
    const data: ICourse[] = await loadCourses();

    // PARÁMETRO de la flecha: c: ICourse -> cada objeto plano del JSON
    // RETORNO de la flecha: Course -> una instancia con método render()
    courses = data.map(
      (c: ICourse): Course => new Course(c.title, c.level, c.duration, c.description)
    );
    renderCatalog(courses);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    catalog.innerHTML = `<p class="error">Error loading courses: ${message}</p>`;
  }
}

init();

const yearElement: HTMLElement | null = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}