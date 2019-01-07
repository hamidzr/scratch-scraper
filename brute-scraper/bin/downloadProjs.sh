#!/bin/bash

# downlaods a list of projects

projectList=$1
getProject=$2 # path to projectGetter

cat $projectList | parallel $getProject

# sequential

# while read projId; do

#   echo processing $projId ..
#   getProjContents $projId

# done < $projectList
