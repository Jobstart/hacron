# HACron

[![Docker](http://dockeri.co/image/jobstartinc/hacron)](https://hub.docker.com/r/jobstartinc/hacron/)

[![CircleCI](https://circleci.com/gh/Jobstart/hacron.svg?style=shield)](https://circleci.com/gh/Jobstart/hacron/tree/master)

### What is HACron
HACron is a highly available distributed system clock that is useful for trigger background jobs such as ETL, scraping, bill processing, and so forth.  Rather than installing Cron on every VM or Docker image, the developer can instead subscribe to timer events through the already familiar AMQP protocol and use these to trigger background jobs.  This results in less overall ops overhead and systems maintenance.

### Why HACron
HACron was designed with simplicity in mind.  The only required configuration options are an [AMQP](https://www.amqp.org/) connection string (ie, RabbitMQ) and a set of [Etcd](https://github.com/coreos/etcd) connection strings, along with optional SSL cert paths for both. You can set it up in minutes, and it scales seamlessly to provide high availability so that you never miss an interval.

HACron utilizes distributed locking via Etcd and the [Microlock](https://github.com/Jobstart/microlock) library to achieve high availability.  You can run as many instances of HACron as you want, and all instances will race to acquire a lock on every tick.  The first instance to acquire a lock will dispatch a message via AMQP.

### Using HACron
HACron was designed to run in a [Docker](https://github.com/docker/docker) container.  Support for manually running HACron is not currently available but may be added near-term.

**It is recommended that you run at least 3 instances of HACron** to achieve high availability in a production environment.

#### Basic usage
To get started, you can run an image manually:

```bash
docker run -d \
  -e "AMQP_URL=amqp://path.to.rabbit//" \
  -e "ETCD_URLS=http://path.to.etcd1,http://path.to.etcd2" \
  -e "MONITOR_PORT=8080" \
  jobstartinc/hacron
```

#### SSL
If you want to provide SSL for AMQP/Etcd connections you can use a docker volume:
```bash
docker run -d \
  -e "AMQP_URL=amqp://path.to.rabbit//" \
  -e "ETCD_URLS=http://path.to.etcd1,http://path.to.etcd2" \
  -e "MONITOR_PORT=8080" \
  -v /my/local/ssl/directory:/opt/ssl \
  jobstartinc/hacron
```

#### Health checks
HACron exposes a monitor endpoint to check memory and CPU stats:

```curl
curl http://localhost:8080/monitor
```

The port for the REST API can be configured via the `MONITOR_PORT` environment variable


### Tick message interface
Each "tick" message will apply the following interface:
```json
{
  "id": "String",
  "minute": "Number",
  "hour": "Number",
  "day_of_month": "Number",
  "day_of_week": "Number",
  "month": "Number",
  "year": "Number",
  "iso": "String",
  "timestamp": "Number",
  "timezone_offset": "String"
}
```

### All configuration options
All configuration is handled via environment variables

`MONITOR_PORT` - Port to expose RESTful API.  (default *`8080`*)

`AMQP_URL` - URL to a AMQP-compatible message queue where tick events will be sent.

`ETCD_URLS` - A set of comma-separated URLs to Etcd instances/clusters

`EXCHANGE_NAME` - Name of the AMQP exchange to publish on (default *`hacron`*)

`LOCK_KEY` - Etcd key string for timer lock (default *`/locks/hacron`*)

`CRON_TIME` - Crontab string for tick frequency (default is every minute)

HACron will look for SSL certs on boot at `/opt/ssl` by name of `etcd.pem` and `amqp.pem` and attempt to use them for connecting to Etcd and an AMQP-compatible message queue (ie, RabbitMQ), respectively.


### Examples
*Coming soon*

### Development tools
```bash
# Lint
make lint

# Build
make tag=build_tag_here

# Test
docker-compose up -d
make test
docker-compose stop
docker-compose rm -f
```
