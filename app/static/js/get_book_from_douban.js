(function () {
    function createMessage(message, type) {
        var type_convert = {
            'success': 'ok',
            'danger': 'ban-circle',
            'info': 'info-sign',
            'warning': 'alert'
        };

        var times = document.createElement('span');
        times.setAttribute('aria-hidden', 'true');
        times.textContent = '×';

        var button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('data-dismiss', 'alert');
        button.setAttribute('aria-label', 'Close');
        button.classList.add('close');
        button.appendChild(times);

        var span = document.createElement('span');
        span.classList.add('glyphicon');
        span.classList.add('glyphicon-' + type_convert[type]);


        var container = document.createElement('div');
        container.setAttribute('role', 'alert');
        container.classList.add('alert');
        container.classList.add('alert-' + type);
        container.classList.add('alert-dismissible');
        container.appendChild(button);
        container.appendChild(span);
        container.innerHTML += ' ' + message;

        var main = document.querySelector('main');
        main.insertBefore(container, main.childNodes[0]);

    }

    document.getElementById('get_book_from_douban').addEventListener('click', function () {
        var isbn = document.getElementById('isbn').value;

        if (isNaN(isbn) || isbn.length != 13) {
            createMessage('Please fill in the correct 13-digit ISBN', 'warning');
        }
        else {
            var douban_API = 'http://api.douban.com/v2/book/isbn/';
            $.getJSON(douban_API + isbn + '?callback=?', {
                    fields: ['isbn', 'title', 'origin_title', 'subtitle',
                        'author', 'translator', 'publisher', 'images', 'pubdate',
                        'tags', 'pages', 'price', 'binding', 'summary', 'catalog'].join(',')
                })
                .done(function (data) {
                    if (data.code) {
                        if (data.code == '6000') {
                            createMessage('Did not find this book', 'danger');
                        }
                        else {
                            createMessage(data.msg, 'danger');
                        }
                    }
                    else {
                        document.getElementById('title').value = data.title;
                        document.getElementById('origin_title').value = data.origin_title;
                        document.getElementById('subtitle').value = data.subtitle;
                        document.getElementById('author').value = data.author.join('/');
                        document.getElementById('translator').value = data.translator.join('/');
                        document.getElementById('publisher').value = data.publisher;
                        document.getElementById('image').value = data.images.large || data.images.medium || data.images.small || '';
                        document.getElementById('pubdate').value = data.pubdate;

                        $('#tags').tokenfield('setTokens', data.tags.map(function (item) {
                            return item.name;
                        }));

                        document.getElementById('pages').value = data.pages;
                        document.getElementById('price').value = data.price;
                        document.getElementById('binding').value = data.binding;
                        document.getElementById('flask-pagedown-summary').value = data.summary.replace(/\n/g, "\n\n");
                        document.getElementById('flask-pagedown-catalog').value = data.catalog.replace(/\n/g, "\n\n");
                        createMessage('Successfully loaded', 'success');
                    }
                })
                .fail(function (data) {
                    if (data.status == '404')
                        createMessage('Failed to load book information!', 'danger');
                    else
                        createMessage(data.statusText, 'danger');
                });

        }
    }, false);
})();
