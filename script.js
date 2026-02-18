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

    // Initialize Language
    const langSwitch = document.querySelector('.lang-switch');
    langSwitch.addEventListener('change', (e) => {
        updateLanguage(e.target.value);
    });
});

// Translations
const translations = {
    en: {
        "nav-home": "home",
        "nav-works": "works",
        "nav-about": "about-me",
        "nav-projects": "projects",
        "nav-skills": "skills",
        "nav-contacts": "contacts",
        "hero-title-1": "Elias is a",
        "hero-title-2": "web designer",
        "hero-title-3": "and",
        "hero-title-4": "front-end developer",
        "hero-sub": "He crafts responsive websites where technologies meet creativity",
        "hero-btn": "Contact me!!",
        "hero-status": "Currently working on",
        "view-all": "View all ~~>",
        "about-greeting": "Hello, I'm Elias!",
        "about-p1": "I'm a self-taught front-end developer based in Kyiv, Ukraine. I can develop responsive websites from scratch and raise them into modern user-friendly web experiences.",
        "about-p2": "Transforming my creativity and knowledge into a websites has been my passion for over a year. I have been helping various clients to establish their presence online. I always strive to learn about the newest technologies and frameworks.",
        "about-readmore": "Read more ->",
        "contact-text": "I'm interested in freelance opportunities. However, if you have other request or question, don't hesitate to contact me",
        "contact-msg": "Message me here"
    },
    id: {
        "nav-home": "beranda",
        "nav-works": "karya",
        "nav-about": "tentang-saya",
        "nav-projects": "proyek",
        "nav-skills": "keahlian",
        "nav-contacts": "kontak",
        "hero-title-1": "Elias adalah seorang",
        "hero-title-2": "perancang web",
        "hero-title-3": "dan",
        "hero-title-4": "pengembang front-end",
        "hero-sub": "Dia membuat situs web responsif di mana teknologi bertemu kreativitas",
        "hero-btn": "Hubungi saya!!",
        "hero-status": "Sedang mengerjakan",
        "view-all": "Lihat semua ~~>",
        "about-greeting": "Halo, saya Elias!",
        "about-p1": "Saya adalah pengembang front-end otodidak yang berbasis di Kyiv, Ukraina. Saya dapat mengembangkan situs web responsif dari awal dan mengubahnya menjadi pengalaman web modern yang ramah pengguna.",
        "about-p2": "Mengubah kreativitas dan pengetahuan saya menjadi situs web telah menjadi hasrat saya selama lebih dari setahun. Saya telah membantu berbagai klien untuk membangun kehadiran online mereka. Saya selalu berusaha mempelajari teknologi dan kerangka kerja terbaru.",
        "about-readmore": "Baca selengkapnya ->",
        "contact-text": "Saya tertarik dengan peluang freelance. Namun, jika Anda memiliki permintaan atau pertanyaan lain, jangan ragu untuk menghubungi saya",
        "contact-msg": "Pesan saya di sini"
    }
};

function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}
