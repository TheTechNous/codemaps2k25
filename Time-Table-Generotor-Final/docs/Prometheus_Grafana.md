# Setting up Prometheus and Grafana for FastAPI Monitoring

This guide provides step-by-step instructions for setting up Prometheus and Grafana to monitor a FastAPI application.

## Prerequisites

- Prometheus installed on your system. [Installation instructions](https://prometheus.io/docs/prometheus/latest/installation/)
- Grafana installed on your system. [Installation instructions](https://grafana.com/docs/grafana/latest/installation/)

## Step 1: Expose Metrics in FastAPI

In the `Backend/app.py` file, the Prometheus metrics server is already started with the line `start_http_server(8001)`. This will expose the metrics at `http://localhost:8001`.

## Step 2: Configure Prometheus

Configure Prometheus to scrape metrics from the FastAPI application by adding the following job to the Prometheus configuration file (`prometheus.yml`):

```yaml
scrape_configs:
  - job_name: 'fastapi'
    static_configs:
      - targets: ['localhost:8001']
```

## Step 3: Start Prometheus

Start Prometheus with the command:

```sh
./prometheus --config.file=prometheus.yml
```

## Step 4: Start Grafana

Start Grafana with the command:

```sh
./bin/grafana-server
```

## Step 5: Add Prometheus as a Data Source in Grafana

1. Open Grafana in a web browser (default: `http://localhost:3000`).
2. Go to Configuration > Data Sources > Add data source.
3. Select Prometheus.
4. Configure the URL (default: `http://localhost:9090`).

## Step 6: Create Grafana Dashboards

Create Grafana dashboards to visualize the metrics collected by Prometheus. You can use pre-built dashboards or create custom ones based on your monitoring needs.

For more detailed instructions, refer to the official Grafana documentation on [creating dashboards](https://grafana.com/docs/grafana/latest/dashboards/).

