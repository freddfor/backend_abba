# BackEnd

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

## Compile all Migrations 
```
npx sequelize-cli db:migrate
```

## Delete all Migrations 
```
npx sequelize-cli db:migrate:undo:all
```

## Compile all Seeders 
```
npx sequelize-cli db:seed:all
```

## Compile one Migrations 
```
npx sequelize-cli db:migrate --to name_migrate.js
```

## Delete one Migrations 
```
npx sequelize-cli db:migrate:undo:all --to name_migrate.js
```