#!/bin/bash

# start crawling, stream the output and persist the job queue

spider_name=raw

pipenv run scrapy crawl $spider_name -s JOBDIR=crawls/$spider_name -o results.jl
