// 頁面切換邏輯
function switchPage(pageId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.scrollTop = 0;
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.getElementById('nav-' + pageId);
    if (activeLink) activeLink.classList.add('active');
}











// 初始化與 Hash 監聽
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash && ['about', 'projects', 'contact'].includes(hash)) {
        switchPage(hash);
    } else {
        switchPage('home');
    }
});

window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        switchPage(hash);
    } else {
        switchPage('home');
    }
});

// 打字機特效
const textElement = document.getElementById('typing-text');
const texts = ['Software Dev', 'AI Technology', 'Cyber Security', 'Stock Analysis'];
let count = 0; 
let index = 0;
let currentText = '';
let letter = '';
let isDeleting = false;

(function type() {
    if (count === texts.length) {
        count = 0;
    }
    currentText = texts[count];

    if (isDeleting) {
        letter = currentText.slice(0, --index);
    } else {
        letter = currentText.slice(0, ++index);
    }

    if(textElement) textElement.textContent = letter;

    let typeSpeed = 100;
    if (isDeleting) {
        typeSpeed = 50;
    }

    if (!isDeleting && letter.length === currentText.length) {
        typeSpeed = 2000; 
        isDeleting = true; 
    } else if (isDeleting && letter.length === 0) {
        isDeleting = false; 
        count++;
        typeSpeed = 500;
    }
    setTimeout(type, typeSpeed);
}());