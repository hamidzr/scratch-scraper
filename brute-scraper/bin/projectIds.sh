#!/bin/bash

# grab project ids

file=$1

# jq '.projectUrl' $file | grep -v null | cut -d '/' -f3

jq '.projectUrl' $file | grep -Eo '[0-9]{5,9}' | sort -u

# grep -v username | grep -Eo '[0-9]{6,12}' $file

# echo timing jq
# time jq '.projectUrl' $file | grep -Eo '[0-9]{5,9}' > /tmp/jq.res

# echo timing jq
# time grep -v username | grep -Eo '[0-9]{6,12}' $file > /tmp/grep.res
