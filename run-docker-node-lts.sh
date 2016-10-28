#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker run --rm -it -v $DIR:/app -v $HOME/.gitconfig:/etc/gitconfig -v $HOME/.ssh/id_rsa:/etc/ssh/ssh_id_rsa -v $HOME/.ssh:/home/dev/.ssh -v $HOME/.npmrc:/home/dev/.npmrc -w /app -t toubiweb/docker-node-dev-tools:lts bash
