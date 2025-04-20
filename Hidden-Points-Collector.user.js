// ==UserScript==
// @name         Hidden Points Collector by Dr. Ahmed Khaled
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  سكريبت تجميع النقاط المخفية بتنفيذ مباشر وواجهة عصرية باسم د. أحمد خالد ✨ م
// @author       Dr. Ahmed Khaled
// @match        *://*.centurygames.com/*
// @updateURL    https://raw.githubusercontent.com/ak2132003/hidden-points-collector/main/hidden-points-collector.user.js
// @downloadURL  https://raw.githubusercontent.com/ak2132003/hidden-points-collector/main/hidden-points-collector.user.js
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // إضافة استايل الأيقونة والواجهة
    const styles = `
        .dr-ah-icon {
            position: fixed;
            top: 20px;
            left: 70%;
            transform: translateX(-50%);
            width: 18px;
            height: 18px;
            background-color: #28a745;
            border-radius: 50%;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 0 10px #28a745;
        }
        .dr-ah-icon:hover::after {
            content: "تجميع النقاط المخفية";
            position: absolute;
            top: 25px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: #fff;
            padding: 6px 10px;
            border-radius: 8px;
            white-space: nowrap;
            font-size: 13px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .dr-ah-panel {
            position: fixed;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            width: 320px;
            background: #1e1e2f;
            color: #fff;
            padding: 20px;
            border-radius: 16px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
            z-index: 9999;
            font-family: Arial, sans-serif;
            display: none;
            animation: fadeIn 0.4s ease-out;
        }
        .dr-ah-panel h2 {
            margin: 0 0 10px;
            font-size: 18px;
            color: #00ffd5;
        }
        .dr-ah-panel input {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 8px;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .dr-ah-panel button {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 8px;
            background-color: #00ffd5;
            color: #000;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .dr-ah-panel button:hover {
            background-color: #00cbb5;
        }
        .dr-ah-close {
            position: absolute;
            top: 10px;
            right: 14px;
            cursor: pointer;
            font-size: 18px;
            color: #ff4444;
            transition: transform 0.3s ease;
        }
        .dr-ah-close:hover {
            transform: rotate(90deg);
        }
        .dr-ah-progress {
            margin-top: 10px;
            background-color: #444;
            border-radius: 10px;
            overflow: hidden;
        }
        .dr-ah-progress-bar {
            height: 12px;
            width: 0%;
            background-color: #00ffd5;
            transition: width 0.1s;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // إضافة أيقونة التشغيل
    const icon = document.createElement('div');
    icon.className = 'dr-ah-icon';
    document.body.appendChild(icon);

    // واجهة التحكم
    const panel = document.createElement('div');
    panel.className = 'dr-ah-panel';
    panel.innerHTML = `
        <div class="dr-ah-close">×</div>
        <h2>جمع النقاط بواسطة د. أحمد خالد</h2>
        <input type="number" id="dr-ah-count" placeholder="عدد التكرارات 🌀" />
        <button id="dr-ah-start">ابدأ الجمع الآن 🚀</button>
        <div class="dr-ah-progress"><div class="dr-ah-progress-bar" id="dr-ah-bar"></div></div>
        <div id="dr-ah-status" style="margin-top:8px; font-size:14px;"></div>
    `;
    document.body.appendChild(panel);

    // إظهار/إخفاء الواجهة
    icon.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    // زر × لإغلاق الواجهة
    panel.querySelector('.dr-ah-close').addEventListener('click', () => {
        panel.style.display = 'none';
    });

    // وظيفة التحقق من SNSID
    function getSNSID() {
        const snsidElement = document.getElementById("user-snsid");
        if (snsidElement) {
            return snsidElement.textContent.split(":")[1].trim();
        }
        return null;
    }

    // وظيفة التحقق من السماحية للاعب
    async function checkPermission(snsid) {
        const response = await fetch('https://maxgmofvvffkrprdxvac.supabase.co/rest/v1/allowed_players?select=snsid&sn_sid=eq.' + snsid, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heGdtb2Z2dmZma3JwcmR4dmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzQ4MjEsImV4cCI6MjA2MDc1MDgyMX0.ozih_ynjAWK0whiFqrLGddTZYJyJtEjuSW-SCQM1XjI',  // API Key الذي زودتني به
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heGdtb2Z2dmZma3JwcmR4dmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzQ4MjEsImV4cCI6MjA2MDc1MDgyMX0.ozih_ynjAWK0whiFqrLGddTZYJyJtEjuSW-SCQM1XjI'
            }
        });

        const data = await response.json();
        return data.length > 0; // إذا كان يوجد الـ SNSID في الجدول، فإن اللاعب مسموح له
    }

    // تنفيذ الطلبات
    document.getElementById('dr-ah-start').addEventListener('click', async () => {
        const snsid = getSNSID();
        if (!snsid) {
            alert('❌ لم يتم العثور على SNSID. تأكد من أنك داخل اللعبة');
            return;
        }

        const isAllowed = await checkPermission(snsid);
        if (!isAllowed) {
            alert('❌ هذا الحساب غير مسموح له باستخدام السكربت.');
            return;
        }

        const count = parseInt(document.getElementById('dr-ah-count').value);
        const bar = document.getElementById('dr-ah-bar');
        const status = document.getElementById('dr-ah-status');

        if (isNaN(count) || count <= 0) {
            status.textContent = '❌ الرجاء إدخال رقم صحيح.';
            return;
        }

        let current = 0;
        bar.style.width = '0%';
        status.textContent = `يتم التنفيذ الآن بواسطة د. أحمد خالد...`;

        const requestData = {
            isDouble: false,
            type: 'seeds',
            action: 'getDrop',
            needResponse: '/Activity/UniversalDrop.save_data',
            cur_sceneid: 0,
            opTime: 73.674
        };

        for (let i = 0; i < count; i++) {
            unsafeWindow.NetUtils.request('/Activity/UniversalDrop', requestData);
            current++;
            const percent = ((current / count) * 100).toFixed(1);
            bar.style.width = `${percent}%`;
            status.textContent = `د. أحمد خالد جمع: ${current} / ${count} (${percent}%)`;
        }

        status.textContent = `✅ تم التنفيذ بنجاح بواسطة د. أحمد خالد`;
        setTimeout(() => { panel.style.display = 'none'; }, 2000);
    });
})();
