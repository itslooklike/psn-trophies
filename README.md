# psn-trophies

## ссылки

https://psnprofiles.com/
https://psntrophyleaders.com/leaderboard/main
https://tustin.dev/psn-php/index.html
https://github.com/fakeshadow/pxs-psn-api

https://my.playstation.com/profile/trueKanta/trophies

## Авторизация

- После ввода логина/пароля, получаю `Cookie: npsso=yv***F41`
- По `https://ca.account.sony.com/api/v1/oauth/authorize` с кукой `npsso`, в `Location` ответа получаю `access_token` (он же `Bearer`)
- Шлю все запросы `Authorization: Bearer 5bfc***863` (он живет `3599`)
