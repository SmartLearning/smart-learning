FROM       ubuntu
MAINTAINER Navid Ghahremani <ghahramani.navid@gmail.com>

ENV JAVA_VERSION 8
ENV JAVA_HOME /usr/lib/jvm/java-8-oracle

# install utilities
RUN apt-get update && apt-get -y install net-tools iputils-ping telnet git nano vim git sudo zip bzip2 fontconfig curl

# install java8
RUN echo 'deb http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main' >> /etc/apt/sources.list.d/java8.list && \
    echo 'deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main' >> /etc/apt/sources.list.d/java8.list && \
    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys C2518248EEA14886 && \
    apt-get update && \
    echo oracle-java${JAVA_VERSION}-installer shared/accepted-oracle-license-v1-1 select true | sudo /usr/bin/debconf-set-selections && \
    apt-get install -y --force-yes --no-install-recommends oracle-java${JAVA_VERSION}-installer oracle-java${JAVA_VERSION}-set-default

# set he locale
RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# install node.js
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo bash -
RUN apt-get install -y nodejs python g++ build-essential

# install yeoman bower grunt gulp
RUN npm install -g yo bower grunt-cli gulp

# configure the "docker" user
RUN groupadd docker -g 999 && useradd docker -s /bin/bash -m -g docker -G docker && adduser docker sudo && usermod -a -G docker docker
RUN echo 'docker:docker' | chpasswd
RUN mkdir -p /home/docker/project
RUN cd /home && chmod -R g+rwx /home/docker && chown -R :docker /home/docker

# install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
RUN sudo apt-get update && sudo apt-get install yarn

# clean
RUN apt-get clean && apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /var/cache/oracle-jdk${JAVA_VERSION}-installer
