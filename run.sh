pm2 delete ecotrack-service
npm i
git pull origin prod
npm run build
pm2 start npm --name "ecotrack-service" -- start