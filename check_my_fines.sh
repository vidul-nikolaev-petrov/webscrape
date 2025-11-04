#!/bin/bash

myData=`cat ./my_driver_ids.txt`
# "my_driver_ids.txt" content is like:
#    --egn 8498980220 --licence 12356789

node ./fines_kat.js $myData
