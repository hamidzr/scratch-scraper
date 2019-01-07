#!/bin/bash

# downlaods a signle project conetents if not already captured

function getProjContents()
{
  local id=$1
  # download it if it isn't downloaded yet
  if [ ! -f $id.project ]; then
    local url="https://projects.scratch.mit.edu/internalapi/project/$id/get"
    curl -s -C - $url -o $id.project
    echo $id captured
  else
    echo $id skipped
  fi
}

getProjContents $1
