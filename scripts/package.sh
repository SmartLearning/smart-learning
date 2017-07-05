#!/usr/bin/env bash
PROFILE=$1
APP_DIR=$2

cd $APP_DIR
./gradlew -P$PROFILE stage
