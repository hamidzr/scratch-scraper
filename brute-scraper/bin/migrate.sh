#!/bin/bash

# migrates a single file to its proper sub directory, thread safe?

fname=$1

# hashes the project name and retuns the first n chars
# each char 36 diff values => divides to 36^n sub directories
function dirName()
{
  local id=$1
  local dir_name=$(echo $id  | md5sum | sed 's/\([a-z0-9]\{2\}\).*/\1/')
  [ ! -d $dir_name ] && mkdir $dir_name
  echo $dir_name
}

if [ -f $fname ]; then

  echo moving $fname

  id=$(echo $fname | sed 's/.project//')
  dir_name=$(dirName $id)
  mv $id.project $dir_name/$id.project

else
  echo $fname is dir or doesnt exist
fi
