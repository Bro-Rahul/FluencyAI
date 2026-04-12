## Backend

### Path /backend 

`run uv run -m api.main` this command will run the fastapi server 

### Rabbit MQ
`run Run the Rabbit MQ Service form the docker-compose file` this will run the rabbitmq instance locally via docker

### Celery 
`run celery -A api.worker worker -I api.tasks -l info` this will start the celery worker for background jobs for generating the reports 

