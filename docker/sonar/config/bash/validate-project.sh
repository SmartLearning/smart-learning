#!/usr/bin/env bash
#/bin/sh

echo "===========================Waiting till Sonarqube initialization==========================="
/home/docker/wait-for-it.sh --host=sonar --port=9000 --strict --timeout=0
echo "===========================Sonarqube is initialized==========================="

echo "=================================Validating the project is started================================="
cd /home/docker/project && ./mvnw sonar:sonar -Dsonar.host.url=http://sonar:9000
echo "=================================Validating the project is finished================================"

echo "==================================================================================================="
echo "===========Now you can check the result in sonar management with http://localhost:9000============="
echo "==================================================================================================="
