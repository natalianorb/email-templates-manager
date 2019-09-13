#!/usr/bin/env sh

# остановить публикацию при ошибках
set -e

# сборка
npm run build

# переход в каталог сборки
cd dist

# если вы публикуете на пользовательский домен
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# если вы публикуете по адресу https://natalianorb.github.io/email-templates-manager
git push -f git@github.com:natalianorb/email-templates-manager.git master:gh-pages

cd -
