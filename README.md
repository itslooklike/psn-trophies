# psn-trophies

## ссылки

- https://psnprofiles.com/
- https://psntrophyleaders.com/leaderboard/main
- https://tustin.dev/psn-php/index.html
- https://github.com/fakeshadow/pxs-psn-api
- https://yourgame.space/
- https://my.playstation.com/profile/trueKanta/trophies

## фичи

- очередь запросов

## Авторизация

- После ввода логина/пароля, получаю `Cookie: npsso=yv***F41`
- По `https://ca.account.sony.com/api/v1/oauth/authorize` с кукой `npsso`, в `Location` ответа получаю `access_token` (он же `Bearer`)
- Шлю все запросы `Authorization: Bearer 5bfc***863` (он живет `3599`)

## redis

```sh
docker run --rm --name some-redis -d -p 6379:6379 redis
docker stop some-redis
```

## test psn acc

```
date: ***REMOVED***
name: ***REMOVED***
psn name: ***REMOVED***
login: ***REMOVED***
pass: ***REMOVED***
```

## test gmail acc

***REMOVED***
***REMOVED***

## Problems

На вебе отключили отображение трофеев, нужно запустить приложение на мобиле

- Android Emulator - не запускается
- BlueStacks - не запускается
- iOS - на эмуляторе нельзя запускать приложение
- iOS реальное устройство - ???
- Android реальное устройство - ???
