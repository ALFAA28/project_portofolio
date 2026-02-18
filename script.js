import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// DOM Elements
const projectsGrid = document.getElementById('projects-grid');

// Fetch Projects from Firestore
async function fetchProjects() {
    // Show Loading or Keep Skeleton
    try {
        const querySnapshot = await getDocs(collection(db, "projects"));

        // Clear skeleton if we have data
        if (!querySnapshot.empty) {
            projectsGrid.innerHTML = '';
        } else {
            projectsGrid.innerHTML = '<p>No projects found.</p>';
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            renderProjectCard(data);
        });

    } catch (error) {
        console.error("Error fetching projects: ", error);
        projectsGrid.innerHTML = '<p>Error loading projects. Check console/config.</p>';
    }
}

// Render Single Project Card
function renderProjectCard(project) {
    const card = document.createElement('div');
    card.classList.add('project-card');

    // Default Image
    const imageUrl = project.imageUrl || 'https://via.placeholder.com/300x200/282C33/FFFFFF?text=Project';

    card.innerHTML = `
        <img src="${imageUrl}" alt="${project.title}" class="project-img">
        <div class="project-tech">${project.technologies}</div>
        <div class="project-body">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-desc">${project.description}</p>
            <div class="project-actions">
                <a href="${project.liveLink || '#'}" target="_blank" class="btn">Live <~></a>
                ${project.repoLink ? `<a href="${project.repoLink}" target="_blank" class="btn btn-outline">Cached >=</a>` : ''}
            </div>
        </div>
    `;

    projectsGrid.appendChild(card);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
});
