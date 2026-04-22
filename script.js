document.addEventListener('DOMContentLoaded', () => {
    const ballContainer = document.getElementById('ball-container');
    const includeInput = document.getElementById('include-nums');
    const excludeInput = document.getElementById('exclude-nums');
    const generateBtn = document.getElementById('generate-btn');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    const themeBtn = document.getElementById('theme-btn');

    // Theme logic
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeBtn.textContent = '☀️ 라이트 모드';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeBtn.textContent = isDark ? '☀️ 라이트 모드' : '🌙 다크 모드';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    let history = JSON.parse(localStorage.getItem('lottoHistory')) || [];
...

    // Initialize history display
    updateHistoryUI();

    generateBtn.addEventListener('click', () => {
        const includeNums = parseInput(includeInput.value);
        const excludeNums = parseInput(excludeInput.value);

        // Validation
        if (includeNums.length > 6) {
            alert('포함할 번호는 최대 6개까지 가능합니다.');
            return;
        }
        
        const conflict = includeNums.filter(n => excludeNums.includes(n));
        if (conflict.length > 0) {
            alert(`포함할 번호와 제외할 번호가 중복됩니다: ${conflict.join(', ')}`);
            return;
        }

        const numbers = generateLottoNumbers(includeNums, excludeNums);
        displayNumbers(numbers);
        addToHistory(numbers);
    });

    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('모든 기록을 삭제하시겠습니까?')) {
            history = [];
            localStorage.removeItem('lottoHistory');
            updateHistoryUI();
        }
    });

    function parseInput(val) {
        return val.split(',')
            .map(s => parseInt(s.trim()))
            .filter(n => !isNaN(n) && n >= 1 && n <= 45);
    }

    function generateLottoNumbers(include, exclude) {
        const pool = [];
        for (let i = 1; i <= 45; i++) {
            if (!include.includes(i) && !exclude.includes(i)) {
                pool.push(i);
            }
        }

        const result = [...include];
        while (result.length < 6 && pool.length > 0) {
            const randomIndex = Math.floor(Math.random() * pool.length);
            result.push(pool.splice(randomIndex, 1)[0]);
        }

        return result.sort((a, b) => a - b);
    }

    function displayNumbers(numbers) {
        ballContainer.innerHTML = '';
        numbers.forEach((num, index) => {
            const ball = document.createElement('div');
            ball.className = `ball ${getRangeClass(num)}`;
            ball.textContent = num;
            ball.style.animation = `fadeIn 0.3s ease forwards ${index * 0.1}s`;
            ball.style.opacity = '0';
            ballContainer.appendChild(ball);
        });
    }

    function getRangeClass(num) {
        if (num <= 10) return 'range-10';
        if (num <= 20) return 'range-20';
        if (num <= 30) return 'range-30';
        if (num <= 40) return 'range-40';
        return 'range-45';
    }

    function addToHistory(numbers) {
        history.unshift(numbers);
        if (history.length > 10) history.pop(); // Keep last 10
        localStorage.setItem('lottoHistory', JSON.stringify(history));
        updateHistoryUI();
    }

    function updateHistoryUI() {
        historyList.innerHTML = '';
        history.forEach(nums => {
            const li = document.createElement('li');
            li.className = 'history-item';
            
            nums.forEach(num => {
                const span = document.createElement('span');
                span.className = `history-ball ${getRangeClass(num)}`;
                span.textContent = num;
                li.appendChild(span);
            });
            
            historyList.appendChild(li);
        });
    }
});
