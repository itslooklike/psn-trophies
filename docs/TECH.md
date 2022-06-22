# TECH

```sh
yarn build # запуск прод сборки

# ручную запуск форматеров
npx prettier 'src/**/*.{js,jsx,ts,tsx,json}' --write
npx eslint 'src/**/*.{js,jsx,ts,tsx}' --fix

docker build -t web .
docker run -e PORT=3005 -p 3005:3005 --init --rm -it web
docker run -e PORT=3005 -p 3005:3005 --init --rm -it web /bin/bash
```

## deploy

```sh
heroku container:push web -a psn-trophies && heroku container:release web -a psn-trophies
heroku logs --tail -a psn-trophies
```

## redis

```sh
docker run --rm --name some-redis -d -p 6379:6379 redis
docker stop some-redis
```

```
# auto login url
http://localhost:3005/?user_id=__USER_ID_HERE__
```

## usefull api links

- https://psnprofiles.com
- https://psntrophyleaders.com/leaderboard/main
- https://www.playstationtrophies.org
- https://www.exophase.com/trophy
- https://yourgame.space

- https://tustin.dev/psn-php/index.html
- https://github.com/fakeshadow/pxs-psn-api
- https://www.colorgamer.com/index.php/archives/470/

## reverse api problems

- Android Emulator - не запускается
- BlueStacks - не запускается
- iOS - на эмуляторе нельзя запускать приложение
- iOS реальное устройство - ???
- Android реальное устройство - ???

## chakra-ui docs

- https://chakra-ui.com/docs/theming/theme#colors
- https://chakra-ui.com/docs/media-and-icons/icon
- https://chakra-ui.com/docs/features/responsive-styles

## how update refresh_token

- https://www.playstation.com/ - логинимся
- https://ca.account.sony.com/api/v1/ssocookie - копируем `npsso`
- `/authz/v3/oauth/authorize` - получаем `code` для активации (будет в ссылке редиректа, нужно отключить `follow redirects`)
- `/authz/v3/oauth/token` - указываем `code` и получаем `refresh_token` и `access_token`

alternative

- После ввода логина/пароля, получаю `Cookie: npsso=yv***F41` по запросу `https://ca.account.sony.com/api/v1/ssocookie`
- По `https://ca.account.sony.com/api/v1/oauth/authorize` с кукой `npsso`, в `Location` ответа получаю `access_token` (он же `Bearer`)
- Шлю все запросы `Authorization: Bearer 5bfc***863` (он живет `3599`)

```js
;(function (open) {
  XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
    this.addEventListener(
      'readystatechange',
      function () {
        if (this.readyState == XMLHttpRequest.DONE) {
          let response = JSON.parse(this.responseText)

          if (response && ('npsso' in response || 'refresh_token' in response)) {
            console.log('👾 >> response', response)
          }
        }
      },
      false
    )

    open.call(this, method, url, async, user, pass)
  }

  window.onbeforeunload = function () {
    return 'Are you sure you want to leave?'
  }
})(XMLHttpRequest.prototype.open)
```
