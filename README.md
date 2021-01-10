# task-issues

## Getting started

### Setup

```bash
git clone https://github.com/zsevic/task-issues
cd task-issues
cp .env.sample .env
npm i
docker-compose up --build -V --remove-orphans
```

### API documentation

Generated at [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

### Docker compose commands

```bash
docker-compose up -V
docker-compose down
```

### Testing

```bash
npm test
```

### Technologies used

- Node.js, TypeScript, NestJS, TypeORM
