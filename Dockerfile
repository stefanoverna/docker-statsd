FROM phusion/baseimage
MAINTAINER Stefano Verna <s.verna@datocms.com>

RUN apt-get -y update && apt-get -y upgrade
RUN apt-get -y --force-yes install git nodejs npm

RUN git clone https://github.com/etsy/statsd.git statsd
ADD config.js ./statsd/config.js
ADD backends/redis ./statsd/backends/redis
ADD backends/cloudwatch ./statsd/backends/cloudwatch
RUN cd statsd/backends/redis && npm install
RUN cd statsd/backends/cloudwatch && npm install

EXPOSE 8125:8125/udp
EXPOSE 8126:8126/tcp
CMD ["/usr/bin/nodejs", "/statsd/stats.js", "/statsd/config.js"]

