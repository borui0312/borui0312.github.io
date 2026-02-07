// 頁面切換邏輯
function switchPage(pageId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // 點亮對應的按鈕 (包含首頁)
    const activeLink = document.getElementById('nav-' + pageId);
    if (activeLink) activeLink.classList.add('active');

    window.scrollTo(0, 0);
}

window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash && (hash === 'about' || hash === 'projects' || hash === 'contact')) {
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

// 打字機特效邏輯
const textElement = document.getElementById('typing-text');
const texts = ['NKUST Student', 'App Developer', 'Market Analyst', 'Keelung Boy'];
let count = 0;
let index = 0;
let currentText = '';
let letter = '';

(function type() {
    if (count === texts.length) {
        count = 0;
    }
    currentText = texts[count];
    letter = currentText.slice(0, ++index);

    textElement.textContent = letter;
    
    if (letter.length === currentText.length) {
        setTimeout(() => {
            count++;
            index = 0;
        }, 2000); 
    }
    
    setTimeout(type, letter.length === currentText.length ? 2000 : 100);
}());