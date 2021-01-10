# task-issues

### Setup

- Run the following commands

```bash
git clone https://github.com/zsevic/task-issues
cd task-issues
cp .env.sample .env
docker-compose up --build -V --remove-orphans
```

- Import Postman collection (`postman_collection.json`) into the Postman

- Test implemented endpoints

```
GET /agents
GET /issues
POST /agents # name in request body is required
POST /issues # title in request body is required
GET /agents/{id}/issues # id (UUID format) param is required
PUT /agents/{id}/issues/{issueId}/resolve # id (UUID format) and issueId (UUID format) params are required
```

### Entities

- agent

  - id (UUID)
  - name
  - status (value: 'AVAILABLE' or 'ASSIGNED')

- issue
  - id (UUID)
  - agent_id (UUID, nullable)
  - title
  - status (value: 'PENDING', 'ASSIGNED' or 'RESOLVED')

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
npm run test:coverage
```

### Technologies used

- Node.js, TypeScript, NestJS, TypeORM
