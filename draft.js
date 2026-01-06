// פונקציה שיוצרת את ה-HTML של הטיוטה ומזריקה אותו לדף
(function() {
    const draftHTML = `
        <button id="draft-open-btn" onclick="toggleDraft()" style="position: fixed; bottom: 20px; right: 20px; border-radius: 50%; width: 60px; height: 60px; background: #ed8936; color: white; border: none; font-size: 24px; cursor: pointer; z-index: 2000; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">📝</button>

        <div id="draft-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 3000; padding: 20px; flex-direction: column; align-items: center; justify-content: center;">
            <div style="background: white; width: 100%; max-width: 600px; height: 80vh; border-radius: 20px; position: relative; display: flex; flex-direction: column; overflow: hidden;">
                <div style="padding: 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f0f0f0; background: #fff;">
                    <b style="color: #333; font-family: sans-serif;">לוח טיוטה לחישובים</b>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="clearDraft()" style="background: #f56565; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-weight: bold;">מחק</b>
                        <button onclick="toggleDraft()" style="background: #4a90e2; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-weight: bold;">סגור</b>
                    </div>
                </div>
                <canvas id="draft-canvas" style="flex-grow: 1; cursor: crosshair; touch-action: none; background: #fff;"></canvas>
            </div>
        </div>
    `;

    // הזרקת ה-HTML לסוף ה-body
    const div = document.createElement('div');
    div.innerHTML = draftHTML;
    document.body.appendChild(div);

    const canvas = document.getElementById('draft-canvas');
    const ctx = canvas.getContext('2d');
    let painting = false;

    // הגדרות צייר
    window.setupCanvas = function() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.lineCap = 'round';
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#2d3748';
    };

    window.toggleDraft = function() {
        const modal = document.getElementById('draft-modal');
        const isOpen = modal.style.display === 'flex';
        modal.style.display = isOpen ? 'none' : 'flex';
        if (!isOpen) {
            setTimeout(setupCanvas, 10); // השהייה קלה כדי שהמידות יתעדכנו
        }
    };

    window.clearDraft = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // לוגיקת ציור
    function startPos(e) { painting = true; draw(e); }
    function endPos() { painting = false; ctx.beginPath(); }
    function draw(e) {
        if (!painting) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    canvas.addEventListener('mousedown', startPos);
    canvas.addEventListener('mouseup', endPos);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startPos(e); }, {passive: false});
    canvas.addEventListener('touchend', endPos);
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, {passive: false});
})();
