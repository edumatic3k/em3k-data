const catalogStatus = document.querySelector('#catalog-status');
const tableBody = document.querySelector('#catalog-courses');

function createCell(content) {
    const cell = document.createElement('td');
    cell.textContent = content;
    return cell;
}

function renderCourse(course) {
    if (
        !course
        || typeof course.id !== 'string'
        || typeof course.title !== 'string'
        || !Array.isArray(course.categories)
        || !course.categories[0]
        || typeof course.categories[0].category !== 'string'
        || typeof course.description !== 'string'
        || typeof course.version !== 'string'
    ) {
        throw new Error('A course is missing its id, title, categories, description, or version.');
    }

    const row = document.createElement('tr');
    row.append(createCell(course.title));

    const categoryCell = document.createElement('td');
    const category = course.categories[0].category;
    const categoryLink = document.createElement('a');
    categoryLink.href = `#?category=${encodeURIComponent(category.toLowerCase())}`;
    categoryLink.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryCell.append(categoryLink);
    row.append(categoryCell);

    row.append(createCell(course.description));
    row.append(createCell(course.version));

    const actionCell = document.createElement('td');
    const installButton = document.createElement('button');
    installButton.type = 'button';
    installButton.dataset.id = course.id;
    installButton.textContent = 'Install';
    actionCell.append(installButton);
    row.append(actionCell);

    return row;
}

async function loadCatalog() {
    try {
        const response = await fetch('catalog.json');
        if (!response.ok) {
            throw new Error(`Catalog request failed (${response.status}).`);
        }

        const catalog = await response.json();
        if (!catalog || !Array.isArray(catalog.courses)) {
            throw new Error('Catalog data must contain a courses array.');
        }

        tableBody.replaceChildren(...catalog.courses.map(renderCourse));
        catalogStatus.textContent = catalog.courses.length
            ? ''
            : 'No courses are currently available.';
    } catch (error) {
        catalogStatus.setAttribute('role', 'alert');
        catalogStatus.textContent = `Unable to load the course catalog: ${error.message}`;
    }
}

loadCatalog();
