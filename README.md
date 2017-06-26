## Requirements

- Yarn
- Docker
- Docker Compose
- Internet Connection!!!
- Linux ( Nice to have ) `Tested only on Ubuntu 16.10`

## Run the project with docker

- Go to root of the project then `app` folder
- Run the commands below:
```
yarn install
yarn start
```
- Then go back to the root folder and go to `docker/app` folder
- Then run
```
docker-compose up -d && docker-compose logs -f --tail=30 app | grep -Ev "(metrics|mongo)"
```

Please wait till the server is showing startup message
- After that you can navigate to http://localhost:8080 to see the application
- We have two users

```
1-
 username: admin
 password: admin
2- 
 username: user
 password: user
```

- Before we finish this section, we have sonar for analyzing Java code quality, to use it you need to go `docker/sonar` folder then run the command below:
- The sonar username/password is `admin/admin`
```
docker-compose up -d && docker-compose logs -f --tail=30 project-validation
```
If you saw it says `BUILD SUCCESS` so it is the time to go `http://localhost:9000` to see the code quality ( AAA )


## Description
No description

### Swagger UI 2
You can navigate to this page ```http://localhost:8080/#/admin/docs``` with admin user and see the swagger ui

## Debugging
To debug the code you need to go to gradle.properties and uncomment the line starts with #debugging then you can connect to application with port 5005