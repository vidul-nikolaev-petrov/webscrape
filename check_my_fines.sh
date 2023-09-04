#!/bin/bash

cat ./my_driver_ids.txt | while read line || [[ -n $line ]];
do
    echo "checking fines for $line" &&
    node fines_kat.js $line &&
    echo
done
