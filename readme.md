Тестовое задание
=================

Инструкция по развертывнию
--------------------------

### Использованные технологии

Проект использует внутри себя 
* [Jekyll](http://jekyllrb.com/) ([on github](https://github.com/mojombo/jekyll)) - этот генератор работает на gh-pages, куда я собрался выкатываться
* [jQuery](http://jquery.com/) ([on github](https://github.com/jrburke/requirejs)) - в основном для работы с DOM
* [jQuery UI](http://jqueryui.com/) ([on github](https://github.com/jquery/jquery-ui))- потому что мне было лень делать свои диалоги, календари и спиннеры
* [requirejs](http://requirejs.org/) ([on github](https://github.com/jrburke/requirejs)) - чтобы было не так мучительно больно искать баги в сотнях джаваскрипта
* [Handlebars](http://handlebarsjs.com/) ([on github](https://github.com/wycats/handlebars.js)) - потому что он отлично работает с requirejs (подсмторел [вот тут](http://events.yandex.ru/talks/273/))

### Сборка 

Для развертывания проекта нужен *Ruby* (для *Jekyll*) и собственно *Jekyll*. 
Инструкция по установке последнего находится [здесь](https://github.com/mojombo/jekyll/wiki/Install).

После этого надо в корневой папке проекта выполнить команду

    jekyll

Если Вы увидите что-то вроде

    Building site: /your/path -> /your/path/_site
    Successfully generated site: /your/path -> /your/path/_site

значит, сайт собран, и можно подключать папку `_site` к веб-серверу.

**Важно:** для просмотра нужно подключить папку `_site` как `http://[host]/curriculum`, 
иначе не подцепятся картинки.

### Сборка скриптов

Для этого требуется *Node*.

После выкачивания проекта нужно в корневой папке сделать

    > npm install requirejs

если `requirejs` ещё не установлен глобально. 
В этой же корневой папке есть файл `app.build.js` c инструкцией для сборщика. Если вы под Windows&#8482;, 
то Вам будет достаточно запустить файл сборщика

    > gather.cmd

иначе надо вызвать команду сборки руками из корня проекта

    > node ./node_modules/requirejs/bin/r.js -o app.build.js

или как-то так.

### Работа с разжатыми скриптами

Для подключения вместо собранных скриптов их разжатых аналогов нужно в файлах `index.html` и `print.html`
в переменной  `var require = {...}` заменить

    baseUrl: 'require/compiled'

на

    baseUrl: 'require'

Если после этого ещё запустить в корне проекта команду

    > jekyll --auto

то все изменения, сделанные снаружи папки `_site`, будут автоматически в неё попадать и отображаться на сайте.


