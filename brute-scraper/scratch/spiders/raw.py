# -*- coding: utf-8 -*-
import scrapy
import re

comments_re = "site-api/comments"
projectpage_re = "projects/\d+/"
user_projects = "users/.*/projects"
user_favorites = "users/.*/favorites"
user_studios = "users/.*/studios" # owner or following
user_follow = "users/.*/follow" #ing or ers
userpage_re = "users/"

regexes = [
  comments_re,
  projectpage_re,
  user_projects,
  user_favorites,
  user_studios,
  user_follow,
  userpage_re,
    ]

interesting_pages_re = "(" + ")|(".join(regexes) + ")"

def is_interesting(pageUrl):
  check = re.search(interesting_pages_re, pageUrl)
  return check != None


class RawSpider(scrapy.Spider):
  name = 'raw'
  allowed_domains = ['scratch.mit.edu']
  start_urls = ['https://scratch.mit.edu/projects/269873985/']

  def parse(self, response):
    # TODO detect page type and parse
    for user in response.css('ul li .title a::text'):
      yield {'username': user.extract()}

    # save the page contents
    # filename = f'quotes-{response.url}.html'
    # with open(filename, 'wb') as f:
    #   f.write(response.body)

    # follow interesting links
    for next_page in response.css('a::attr(href)'):
      if next_page is not None:
        next_page = next_page.extract()
        if is_interesting(next_page):
          print('following', next_page)
          yield response.follow(next_page, self.parse)




if __name__ == '__main__':
  isit = is_interesting('// https://scratch.mit.edu/users/USERNAME/foallowers/ ')
  print(isit)
