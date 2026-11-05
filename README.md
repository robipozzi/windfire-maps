# Windfire Maps
[![CI](https://github.com/robipozzi/windfire-maps/actions/workflows/ci.yml/badge.svg)](https://github.com/robipozzi/windfire-maps/actions/workflows/ci.yml)

- [Introduction](#introduction)
- [Service implementation](#service-implementation)
- [Deployment](#deployment)
- [Dependency monitoring and CI](#dependency-monitoring-and-ci)

## Introduction
This project implements backend services that wrap Google Maps APIs.

The application exposes 2 endpoints:
* **/api/places/autocomplete**, which takes a string as an input, such as an address (or part of an address), and implements *Google Maps autocomplete proxy*
* **/api/places/details**, which takes a *place_id* from the Google Maps response and implements *Google Maps place details proxy*

## Service implementation
The application is implemented using NodeJs technology, in **[app.js](app/app.js)**.

The application uses **dotenv** module to read the needed environment variables (i.e.: **GOOGLE_MAPS_API_KEY** and **PORT**) from **[.env](app/.env_PLACEHOLDER)** file, then starts a web server on port **PORT** (by default this is 3000). A convenient script **[app-run.sh](app/app-run.sh)** is provided to launch the server.

Once the web server has started, the two endpoints described above are available to be called.

## Deployment
The project provides procedures, based on Ansible, to deploy the application to different target platforms (currently only deployment to Raspberry has been implemented).

The **[deploy.sh](deploy.sh)** script manages the deployment procedures, delegating to specific Ansible playbooks for the different target platform.

The **[windfire-maps.yaml](deployment/raspberry/windfire-maps.yaml)** playbook is provided to do the following tasks on all Raspberry Pi boxes labeled as *maps_service* hosts:

    * Stop Node.js application service
    * Delete Node.js application service
    * Remove Node.js application folder on Raspberry box
    * Transfer all the Node.js files of this project
    * Install Node.Js dependencies
    * Start Node.js application service

All the start/stop actions on NodeJs application are based on **pm2** (*https://pm2.keymetrics.io/*), a daemon process manager that helps managing NodeJs more effectively; the deployment procedure requires and expects **pm2** to be already installed on the target Raspberry Pi box: a specific Ansible playbook **[raspberry-sw-prereqs.yaml](https://github.com/robipozzi/windfire-raspberry/blob/master/raspberry-sw-prereqs.yaml)** is provided in my other GitHub repo **[windfire-raspberry](https://github.com/robipozzi/windfire-raspberry)**, see the following link for instructions *https://github.com/robipozzi/windfire-raspberry?tab=readme-ov-file#Software-prereqs-installation-automation-task*

Playbook refers to **[config.yml](deployment/raspberry/conf/config.yml)** yaml file provided in *[conf](deployment/raspberry/conf)* sub-folder for common variables setup and usage.

## Dependency monitoring and CI
The badge at the top of this page shows the latest **[CI workflow](.github/workflows/ci.yml)** run on *main*; click it to see all runs. The workflow runs on every pull request and on every push to *main*:

    * Install Node.js dependencies from the lock file (npm ci), using the same Node.js major version as the Raspberry Pi
    * Run the tests, if package.json defines a test script (it currently does not)
    * Fail on production dependencies with high or critical vulnerabilities (npm audit)
    * On pull requests only, fail if the pull request adds a dependency with a high or critical vulnerability (dependency review)

**[Dependabot](.github/dependabot.yml)** checks the npm dependencies in *app* and the GitHub Actions used by the workflow every week. Minor and patch updates are grouped into one pull request for each of the two, major updates get their own pull requests, and each of the two has at most 5 version update pull requests open at a time.

To read the alerts, go to the **Security** tab of the repository and open **Dependabot** (*https://github.com/robipozzi/windfire-maps/security/dependabot*; you need access to the repository's security alerts). Each alert shows the affected package and file, the severity, the advisory and the first patched version, and links to the Dependabot pull request if there is one.