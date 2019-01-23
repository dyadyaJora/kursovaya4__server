# kursovaya4__server
NodeJS serverside for kursovaya4

## Как запустить
Необходимо создать файл ` config.js `, хранящий конфигурацию для проекта(закрытые ключи)

```
{
  baseUrl: ...,
  mongodbUri: 'mongodb://localhost/taxi-service-dev',
  googleMapKey: ...,
  passportOptions: {
    facebook: {
      clientID: ...,
      clientSecret: ...,
      callbackURL: baseUrl + '/api/auth/facebook',
      profileFields: ['id', 'displayName', 'picture.type(large)']
    },

    vkontakte: {
      clientID: ...,
      clientSecret: ...,
      callbackURL: baseUrl + '/api/auth/vkontakte'
    }

  }

}
```

Так как сервер работает по https - необходимо сгенерировать(или приобрести сертификат) и положить в корень проекта 2 файла - публичный и приватный ключи  `ca.crt` & `ca.key`. 

Установить модули
 
    npm install
    
Запуск в dev-режиме

    npm run start:dev
    
Запуск в prod

    npm start
    

