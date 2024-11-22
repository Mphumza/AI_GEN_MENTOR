import './style.css';
import { auth } from './src/config/firebase.js';
import { CVGenerator } from './src/pages/CVGenerator.js';
import { CVResult } from './src/pages/CVResult.js';
import { JobMatches } from './src/pages/JobMatches.js';
import { LoginForm, RegisterForm } from './src/components/AuthForms.js';
import { handleSignIn, handleSignUp, handleSignOut } from './src/services/auth.js';
import { generateCV } from './src/services/cv.js';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();
let currentPage = 'cv-generator';
let generatedCV = null;
let jobMatches = null;

function showAuthModal(content) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.innerHTML = content;
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  return modal;
}

function renderPage() {
  const app = document.getElementById('app');
  const header = `
    <header class="bg-purple-600 text-white py-4 shadow-md">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold">EmpowerHer Career Hub</h1>
        <div id="auth-buttons" class="space-x-4">
          <button id="login" class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors">
            Login
          </button>
          <button id="signup" class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  `;

  let content;
  switch (currentPage) {
    case 'cv-generator':
      content = CVGenerator();
      break;
    case 'cv-result':
      content = CVResult(generatedCV);
      break;
    case 'job-matches':
      content = JobMatches({ jobs: jobMatches });
      break;
    default:
      content = CVGenerator();
  }

  app.innerHTML = header + content;
  initializeEventListeners();
}

function initializeEventListeners() {
  // Auth event listeners
  const loginBtn = document.getElementById('login');
  const signupBtn = document.getElementById('signup');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const modal = showAuthModal(LoginForm());
      
      const loginForm = modal.querySelector('#login-form');
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          const email = loginForm.querySelector('#login-email').value;
          const password = loginForm.querySelector('#login-password').value;
          await handleSignIn(email, password);
          modal.remove();
        } catch (error) {
          alert(error.message);
        }
      });

      modal.querySelector('#show-register').addEventListener('click', () => {
        modal.remove();
        signupBtn.click();
      });
    });
  }

  if (signupBtn) {
    signupBtn.addEventListener('click', () => {
      const modal = showAuthModal(RegisterForm());
      
      const registerForm = modal.querySelector('#register-form');
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          const email = registerForm.querySelector('#register-email').value;
          const password = registerForm.querySelector('#register-password').value;
          const confirmPassword = registerForm.querySelector('#register-confirm-password').value;

          if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
          }

          await handleSignUp(email, password);
          modal.remove();
        } catch (error) {
          alert(error.message);
        }
      });

      modal.querySelector('#show-login').addEventListener('click', () => {
        modal.remove();
        loginBtn.click();
      });
    });
  }

  // CV Form event listener
  const cvForm = document.getElementById('cv-form');
  if (cvForm) {
    cvForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const formData = {
          fullName: cvForm.querySelector('#fullName').value,
          contactInfo: cvForm.querySelector('#contactInfo').value,
          cvType: cvForm.querySelector('#cvType').value,
          summary: cvForm.querySelector('#summary').value,
          skills: Array.from(cvForm.querySelector('#skills').selectedOptions).map(opt => opt.value),
          experience: cvForm.querySelector('#experience').value,
          education: cvForm.querySelector('#education').value,
          certifications: cvForm.querySelector('#certifications').value,
          awards: cvForm.querySelector('#awards').value
        };

        const result = await generateCV(formData);
        generatedCV = {
          markdown: result.cv,
          html: md.render(result.cv),
          formData
        };
        jobMatches = result.jobMatches;
        
        currentPage = 'cv-result';
        renderPage();
      } catch (error) {
        alert('Error generating CV: ' + error.message);
      }
    });
  }

  // CV Result page event listeners
  const viewMatchesBtn = document.getElementById('view-matches');
  if (viewMatchesBtn) {
    viewMatchesBtn.addEventListener('click', () => {
      currentPage = 'job-matches';
      renderPage();
    });
  }

  // Job Matches page event listeners
  const backToCVBtn = document.getElementById('back-to-cv');
  if (backToCVBtn) {
    backToCVBtn.addEventListener('click', () => {
      currentPage = 'cv-result';
      renderPage();
    });
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  renderPage();

  // Listen for auth state changes
  auth.onAuthStateChanged((user) => {
    const authButtons = document.getElementById('auth-buttons');
    if (user) {
      authButtons.innerHTML = `
        <span class="mr-4">Welcome, ${user.email}</span>
        <button id="logout" class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Logout
        </button>
      `;
      document.getElementById('logout').addEventListener('click', async () => {
        try {
          await handleSignOut();
        } catch (error) {
          alert(error.message);
        }
      });
    } else {
      renderPage();
    }
  });
});