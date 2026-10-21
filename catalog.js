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
        || typeof course.name !== 'string'
        || typeof course.category !== 'string'
        || typeof course.description !== 'string'
    ) {
        throw new Error('A course is missing its name, category, or description.');
    }

    const row = document.createElement('tr');
    row.append(createCell(course.name));

    const categoryCell = document.createElement('td');
    const categoryLink = document.createElement('a');
    categoryLink.href = `#?category=${encodeURIComponent(course.category.toLowerCase())}`;
    categoryLink.textContent = course.category;
    categoryCell.append(categoryLink);
    row.append(categoryCell);

    row.append(createCell(course.description));

    const actionCell = document.createElement('td');
    const installButton = document.createElement('button');
    installButton.type = 'button';
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
