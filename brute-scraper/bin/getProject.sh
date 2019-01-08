#!/bin/bash

# downlaods a signle project conetents if not already captured


# hashes the project name and retuns the first 3 chars
function dirName()
{
  project_id=$1
  local dir_name=$(echo $project_id  | md5sum | sed 's/\([a-z0-9]\{3\}\).*/\1/')
  echo $dir_name
}


function getProjContents()
{
  local id=$1
  local dir_name=$(dirName $id)
  local file_path=$dir_name/$id.project

  # create the dir if needed
  [ ! -d $dir_name ] && mkdir $dir_name

  # download it only if it isn't downloaded yet
  if [ ! -f $file_path ]; then
    local url="https://projects.scratch.mit.edu/internalapi/project/$id/get"
    curl -s -C - $url -o $file_path
    # wget -O $file_path -q $url
    echo $id captured
  else
    echo $id skipped
  fi
}

getProjContents $1
