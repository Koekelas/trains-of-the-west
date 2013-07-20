#!/bin/bash

CURRENT_HOUR=`TZ=Europe/Brussels date +%H`
START_HOUR=8
STOP_HOUR=22

case $CURRENT_HOUR in
    $START_HOUR )
        ctl_app start
        ;;
    $STOP_HOUR )
        ctl_app stop
        ;;
esac
