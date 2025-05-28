const lenguajeSeleccion = document.getElementById('selector-lenguaje');
const detallesRepo = document.getElementById('detallesRepo');
const cargando = document.getElementById('cargando');
const errorDiv = document.getElementById('error');
const empty = document.getElementById('vacio');
const refreshButton = document.getElementById('refresh');

const languagesUrl = 'https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json';

async function loadLanguages() {
  try {
    const response = await fetch(languagesUrl);
    const languages = await response.json();
    populateLanguageDropdown(languages);
  } catch (error) {
    showError('Falló al cargar lenguajes.');
  }
}

function populateLanguageDropdown(languages) {
  languages.forEach(language => {
    const option = document.createElement('option');
    option.value = language.value;
    option.textContent = language.title;
    lenguajeSeleccion.appendChild(option);
  });
}

async function fetchRandomRepo() {
  const selectedLanguage = lenguajeSeleccion.value;
  if (!selectedLanguage) {
    alert('Por favor seleccione un lenguaje.');
    return;
  }

  showcargando();
  clearMessages();

  const apiUrl = `https://api.github.com/search/repositories?q=language:${selectedLanguage}&sort=stars&per_page=100`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
        const randomRepo = data.items[Math.floor(Math.pow(Math.random(), 2) * data.items.length)];
              displayRepo(randomRepo);
    } else {
      showEmpty();
    }
  } catch (error) {
    hidedetallesRepo();
    showError('No se pudo obtener el repositorio.');
  } finally {
    hidecargando();
  }
}

function displayRepo(repo) {
  detallesRepo.style.display = 'flex';
  detallesRepo.innerHTML = `
        <h2>${repo.name}</h2>
        <p>${repo.description || 'No hay descripción disponible'}</p>
        <div class="repo-info">
        <p>
          <i class="fas fa-star"></i> ${repo.stargazers_count}
        </p>
        <p>
          <i class="fas fa-code-branch"></i> ${repo.forks_count}
        </p>
        <p>
          <i class="fas fa-exclamation-circle"></i> ${repo.open_issues_count}
        </p>
        <a href="${repo.html_url}" target="_blank">Ver en GitHub</a>
        </div>
      `;
  refreshButton.style.display = 'block';
}

function showcargando() {
  hidedetallesRepo();
  cargando.style.display = 'flex';
}

function hidecargando() {
  cargando.style.display = 'none';
}

function hidedetallesRepo() {
  detallesRepo.style.display = 'none';
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.style.display = 'flex';
}

function showEmpty() {
  hidedetallesRepo();
  empty.style.display = 'flex';
}

function clearMessages() {
  errorDiv.style.display = 'none';
  empty.style.display = 'none';
  detallesRepo.innerHTML = '';
}

lenguajeSeleccion.addEventListener('change', fetchRandomRepo);
refreshButton.addEventListener('click', fetchRandomRepo);

loadLanguages();