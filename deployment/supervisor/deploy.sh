#!/bin/bash

if [[ $UID != 0 ]]; then
    echo "Please run this script with sudo:"
    echo "sudo $0 $*"
    exit 1
fi

cp iwy_frontend.conf /etc/supervisor/conf.d/
supervisorctl reread
supervisorctl update
supervisorctl status all
