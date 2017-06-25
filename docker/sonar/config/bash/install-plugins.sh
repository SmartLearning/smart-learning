#!/usr/bin/env bash
#/bin/sh

JAVA_PLUGIN_VERSION=4.7.0.9212
FINDBUGS_PLUGIN_VERSION=3.4.4
PMD_PLUGIN_VERSION=2.6

echo "===========================Waiting till DB initialization==========================="
/opt/sonarqube/bin/wait-for-it.sh --host=db --port=3306 --strict --timeout=0
echo "===========================DB is initialized==========================="

cd /opt/sonarqube/extensions/plugins && \

if ! [ -f sonar-java-plugin-${JAVA_PLUGIN_VERSION}.jar ]; then
  echo "===========================Downloading java plugin version ${JAVA_PLUGIN_VERSION} has been started==========================="
  wget -O sonar-java-plugin-${JAVA_PLUGIN_VERSION}.jar https://sonarsource.bintray.com/Distribution/sonar-java-plugin/sonar-java-plugin-${JAVA_PLUGIN_VERSION}.jar
  echo "===========================Downloading java plugin version ${JAVA_PLUGIN_VERSION} has been finished==========================="
fi

if ! [ -f ./sonar-findbugs-plugin-${FINDBUGS_PLUGIN_VERSION}.jar ]; then
  echo "===========================Downloading find bugs version ${FINDBUGS_PLUGIN_VERSION} has been started==========================="
  wget -O ./sonar-findbugs-plugin-${FINDBUGS_PLUGIN_VERSION}.jar https://github.com/SonarQubeCommunity/sonar-findbugs/releases/download/${FINDBUGS_PLUGIN_VERSION}/sonar-findbugs-plugin-${FINDBUGS_PLUGIN_VERSION}.jar
  echo "===========================Downloading find bugs version ${FINDBUGS_PLUGIN_VERSION} has been finished==========================="
fi

if ! [ -f ./sonar-pmd-plugin-${PMD_PLUGIN_VERSION}.jar ]; then
  echo "===========================Downloading pmd plugin version ${PMD_PLUGIN_VERSION} has been started==========================="
  wget -O ./sonar-pmd-plugin-${PMD_PLUGIN_VERSION}.jar https://github.com/SonarQubeCommunity/sonar-pmd/releases/download/${PMD_PLUGIN_VERSION}/sonar-pmd-plugin-${PMD_PLUGIN_VERSION}.jar
  echo "===========================Downloading pmd plugin version ${PMD_PLUGIN_VERSION} has been finished==========================="
fi

cd /opt/sonarqube/ && ./bin/run.sh