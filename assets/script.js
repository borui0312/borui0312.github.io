// 頁面切換邏輯
function switchPage(pageId) {
    // 隱藏所有頁面
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // 顯示當前頁面
    const targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.scrollTop = 0;
    }

    // 移除導覽列狀態
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // 點亮導覽列
    const activeLink = document.getElementById('nav-' + pageId);
    if (activeLink) activeLink.classList.add('active');
}





// 書籤邏輯
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash && ['about', 'projects', 'contact'].includes(hash)) {
        switchPage(hash);
    } else {
        switchPage('home');
    }
});

// 上一頁 or 下一頁邏輯
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
// 文字列表
const texts = ['Software Dev', 'AI Technology', 'Cyber Security'];
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





// resume 彈窗顯示
(function() {
    const modal = document.getElementById("resume-modal");
    const btn = document.getElementById("open-resume");
    const closeBtn = document.querySelector(".close-modal");
        
    if(btn && modal && closeBtn) {
        // 打開檢視
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = "flex"; // 使用 flex 確保置中
            document.body.style.overflow = "hidden"; // 禁止背景滾動
        });
            
        // 關閉 Modal (按 X)
        closeBtn.addEventListener('click', function() {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        });
            
        // 關閉 Modal (按背景)
        window.addEventListener('click', function(e) {
            if (e.target == modal) {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }
})();





// transcript 彈窗顯示
(function() {
    const modal = document.getElementById("transcript-modal");
    const btn = document.getElementById("open-transcript");
    const closeBtn = modal ? modal.querySelector(".close-modal") : null;
        
    if(btn && modal && closeBtn) {
        // 打開檢視
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = "flex"; 
            document.body.style.overflow = "hidden";
        });
        
        // 關閉 Modal (按 X)
        closeBtn.addEventListener('click', function() {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        });
        
        // 關閉 Modal (按背景)
        window.addEventListener('click', function(e) {
            if (e.target == modal) {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }
})();