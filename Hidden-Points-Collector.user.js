// ==UserScript==
// @name         Hidden Points Collector by Dr. Ahmed Khaled with SNSID Check & Auto Update
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  سكريبت تجميع النقاط المخفية مع التحقق من الـ SNSID والتحديثات التلقائية من GitHub
// @match        *://*.centurygames.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // 1. إضافة الأيقونة الحمراء لعرض الـ snsID
    const icon = document.createElement('div');
    icon.className = 'dr-ah-icon';
    icon.style.position = 'fixed';
    icon.style.top = '20px';
    icon.style.left = '10px';
    icon.style.backgroundColor = '#ff4444';
    icon.style.color = '#fff';
    icon.style.padding = '10px';
    icon.style.borderRadius = '50%';
    icon.style.cursor = 'pointer';
    icon.style.zIndex = '9999';
    icon.style.boxShadow = '0 0 10px #ff4444';
    icon.textContent = '🔴';

    // 2. المربع لعرض الـ snsID
    const snsidBox = document.createElement('div');
    snsidBox.style.position = 'fixed';
    snsidBox.style.top = '60px';
    snsidBox.style.left = '50%';
    snsidBox.style.transform = 'translateX(-50%)';
    snsidBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    snsidBox.style.color = '#fff';
    snsidBox.style.padding = '10px 20px';
    snsidBox.style.borderRadius = '10px';
    snsidBox.style.fontSize = '16px';
    snsidBox.style.fontFamily = 'Arial, sans-serif';
    snsidBox.style.zIndex = '9999';
    snsidBox.style.display = 'none';
    document.body.appendChild(icon);
    document.body.appendChild(snsidBox);

    // 3. إظهار/إخفاء المربع عند الضغط على الأيقونة
    icon.addEventListener('click', () => {
        snsidBox.style.display = snsidBox.style.display === 'none' ? 'block' : 'none';
    });

    // 4. استخراج الـ snsID من الصفحة
    const snsidElement = document.getElementById('user-snsid');
    if (!snsidElement) {
        console.log("لم يتم العثور على الـ snsID في الصفحة.");
        return;
    }
    const snsid = snsidElement.textContent.replace("SNSID : ", "");
    snsidBox.textContent = `SNSID اللاعب: ${snsid}`;

    // 5. التحقق من الـ snsID في Supabase
    const supabaseUrl = 'https://kmuqpicxgiwxjruzlvda.supabase.co';
    const supabaseApiKey = 'your_api_key_here';  // قم بوضع المفتاح الخاص بك هنا
    const tableName = 'users';
    const allowedTable = 'allowed_users';

    GM_xmlhttpRequest({
        method: "GET",
        url: `${supabaseUrl}/rest/v1/${tableName}?snsid=eq.${snsid}`,
        headers: {
            "apikey": supabaseApiKey,
            "Authorization": `Bearer ${supabaseApiKey}`,
            "Content-Type": "application/json"
        },
        onload: function (response) {
            const userData = JSON.parse(response.responseText);
            if (userData.length > 0) {
                const isAllowed = userData[0].allowed === true; // إذا كانت القيمة "allowed" صحيحة

                if (isAllowed) {
                    GM_notification("الـ SNSID مسموح له باستخدام السكربت!", "موافق");
                    startHiddenPointsCollector(); // بدء تجميع النقاط المخفية
                } else {
                    GM_notification("الـ SNSID غير مسموح له باستخدام السكربت.", "مرفوض");
                }
            } else {
                GM_notification("لم يتم العثور على الـ SNSID في القاعدة.", "خطأ");
            }
        }
    });

    // 6. التحديث التلقائي للسكريبت من GitHub
    const githubUrl = 'https://raw.githubusercontent.com/ak2132003/hidden-points-collector/main/Hidden%20Points%20Collector%20by%20Dr.%20Ahmed%20Khaled.js';

    GM_xmlhttpRequest({
        method: "GET",
        url: githubUrl,
        onload: function (response) {
            const latestScript = response.responseText;
            const currentScript = GM_getValue('currentScript', '');

            // إذا كان السكربت الجديد مختلف عن القديم
            if (latestScript !== currentScript) {
                GM_setValue('currentScript', latestScript); // حفظ السكربت الجديد
                GM_notification("تم تحديث السكربت بنجاح!", "تحديث");
                eval(latestScript); // تنفيذ السكربت الجديد
            }
        }
    });

    // 7. وظيفة تجميع النقاط المخفية
    function startHiddenPointsCollector() {
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
            }
            .dr-ah-panel h2 {
                margin: 0 0 10px;
                font-size: 18px;
                color: #00ffd5;
            }
            .dr-ah-panel input, .dr-ah-panel button {
                width: 100%;
                padding: 10px;
                border: none;
                border-radius: 8px;
                margin-bottom: 10px;
                font-size: 16px;
            }
            .dr-ah-panel button {
                background-color: #00ffd5;
                color: #000;
                font-weight: bold;
                cursor: pointer;
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // واجهة التحكم
        const panel = document.createElement('div');
        panel.className = 'dr-ah-panel';
        panel.innerHTML = `
            <h2>جمع النقاط بواسطة د. أحمد خالد</h2>
            <input type="number" id="dr-ah-count" placeholder="عدد التكرارات 🌀" />
            <button id="dr-ah-start">ابدأ الجمع الآن 🚀</button>
            <div id="dr-ah-status" style="margin-top:8px; font-size:14px;"></div>
        `;
        document.body.appendChild(panel);

        document.getElementById('dr-ah-start').addEventListener('click', async () => {
            const count = parseInt(document.getElementById('dr-ah-count').value);
            const status = document.getElementById('dr-ah-status');

            if (isNaN(count) || count <= 0) {
                status.textContent = '❌ الرجاء إدخال رقم صحيح.';
                return;
            }

            status.textContent = `يتم التنفيذ الآن بواسطة د. أحمد خالد...`;

            // تنفيذ تجميع النقاط المخفية
            for (let i = 0; i < count; i++) {
                unsafeWindow.NetUtils.request('/Activity/UniversalDrop', {
                    isDouble: false,
                    type: 'seeds',
                    action: 'getDrop',
                    needResponse: '/Activity/UniversalDrop.save_data',
                    cur_sceneid: 0,
                    opTime: 73.674
                });
            }

            status.textContent = `✅ تم التنفيذ بنجاح بواسطة د. أحمد خالد`;
            setTimeout(() => { panel.style.display = 'none'; }, 2000);
        });

        panel.style.display = 'block';
    }
})();
