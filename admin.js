import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Replace with your ImgBB API Key
const IMGBB_API_KEY = "YOUR_IMGBB_API_KEY";

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const addProjectForm = document.getElementById('add-project-form');
const adminProjectList = document.getElementById('admin-project-list');
const loginMsg = document.getElementById('login-msg');
const addMsg = document.getElementById('add-msg');

// Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        loginSection.classList.add('hidden');
        dashboardSection.style.display = 'block';
        loadProjects(); // Load projects on login
    } else {
        // User is signed out
        loginSection.classList.remove('hidden');
        dashboardSection.style.display = 'none';
    }
});

// Login Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    loginMsg.textContent = 'Logging in...';
    loginMsg.className = '';

    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginMsg.textContent = '';
        loginForm.reset();
    } catch (error) {
        loginMsg.textContent = "Error: " + error.message;
        loginMsg.className = 'error-msg';
    }
});

// Logout Handler
logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
});

// ImgBB Upload Function
async function uploadImageToImgBB(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            return data.data.url; // Return the Display URL
        } else {
            throw new Error('ImgBB Upload Failed');
        }
    } catch (error) {
        console.error("Image Upload Error:", error);
        throw error;
    }
}

// Add Project Handler
addProjectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    addMsg.textContent = 'Uploading image...';
    addMsg.className = '';

    const title = document.getElementById('p-title').value;
    const tech = document.getElementById('p-tech').value;
    const desc = document.getElementById('p-desc').value;
    const live = document.getElementById('p-live').value;
    const repo = document.getElementById('p-repo').value;
    const imageFile = document.getElementById('p-image-file').files[0];

    try {
        // 1. Upload Image
        const imageUrl = await uploadImageToImgBB(imageFile);
        addMsg.textContent = 'Saving project...';

        // 2. Add to Firestore
        await addDoc(collection(db, "projects"), {
            title: title,
            technologies: tech,
            description: desc,
            imageUrl: imageUrl,
            liveLink: live,
            repoLink: repo,
            createdAt: new Date()
        });

        addMsg.textContent = 'Project added successfully!';
        addMsg.className = 'success-msg';
        addProjectForm.reset();
        loadProjects(); // Refresh list

    } catch (error) {
        addMsg.textContent = "Error: " + error.message;
        addMsg.className = 'error-msg';
    }
});

// Load Projects Function (Admin View)
async function loadProjects() {
    adminProjectList.innerHTML = 'Loading...';
    try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        adminProjectList.innerHTML = '';

        if (querySnapshot.empty) {
            adminProjectList.innerHTML = '<p>No projects yet.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const item = document.createElement('div');
            item.classList.add('project-list-item');
            item.innerHTML = `
                <div class="project-info">
                    <h4>${data.title}</h4>
                    <small>${data.technologies}</small>
                </div>
                <button class="delete-btn" data-id="${doc.id}">Delete</button>
            `;
            adminProjectList.appendChild(item);

            // Delete Event Listener
            item.querySelector('.delete-btn').addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this project?')) {
                    await deleteDoc(doc(db, "projects", doc.id));
                    loadProjects(); // Refresh
                }
            });
        });

    } catch (error) {
        console.error("Error loading projects:", error);
        adminProjectList.innerHTML = '<p style="color:red">Error loading list.</p>';
    }
}
