#!/bin/bash

for i in `cat my_plates.txt`
do
    echo "checking plate $i" &&
    node bgtoll.js $i &&
    echo
done
