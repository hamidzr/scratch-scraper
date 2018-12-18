# -*- coding: utf-8 -*-
import scrapy
import re

comments_re = "site-api/comments"
user_projects_re = "users/.*/projects"
user_favorites_re = "users/.*/favorites"
user_studios_re = "users/.*/studios" # owner or following
user_follow_re = "users/.*/follow" #ing or ers
project_remixes_re = "projects/.*/remixes"
projectpage_re = "projects/\d+/"
studiopage_re = "studios/\d+/"
userpage_re = "users/"

regexes = [
  comments_re,
  projectpage_re,
  project_remixes_re,
  user_projects_re,
  user_favorites_re,
  user_studios_re,
  user_follow_re,
  userpage_re,
    ]

interesting_pages_re = "(" + ")|(".join(regexes) + ")"

def has_regex(string, regex):
  check = re.search(regex, string)
  return check != None

def is_interesting(pageUrl):
  check = re.search(interesting_pages_re, pageUrl)
  return check != None


class RawSpider(scrapy.Spider):
  name = 'raw'
  allowed_domains = ['scratch.mit.edu']
  start_urls = ['https://scratch.mit.edu/projects/269873985/']

  def parse(self, response):

    # parse projects anywhere you see them
    for project in response.css('ul li.project'):
      yield {'projectTitle': project.css('span.title a::text').extract_first(),
             'projectUrl': project.css('span.title a::attr(href)').extract_first(),
             'owner': project.css('span.owner a::text').extract_first()}

    if has_regex(response.url, comments_re):
      pass
    # elif has_regex(response.url, user_projects_re):
    #   pass
    # elif has_regex(response.url, user_favorites_re):
    #   pass
    # elif has_regex(response.url, user_studios_re):
    #   pass
    # elif has_regex(response.url, user_follow_re):
    #   pass
    # elif has_regex(response.url, project_remixes_re):
    #   pass
    elif has_regex(response.url, projectpage_re):
      proj_sel = response.css('#project')
      project_dic = {'projectTitle': proj_sel.css('h2#title::text').extract_first(),
                     'projectUrl': response.url,
                     'owner': proj_sel.css('#owner::text').extract_first(),
                     'tags': response.css('#project-tags span.tag a::text').extract(),
                     'modified': proj_sel.css('.date-updated::text').extract_first(),
                     'shared': proj_sel.css('.date_shared::text').extract_first(),
                     'views': proj_sel.css('#total-views span.views::text').extract_first(),
                     'hearts': proj_sel.css('#love-this span.icon::text').extract_first(),
                     'stars': proj_sel.css('#stats span.favorite::text').extract_first(),
                     'counts': response.css('.box-head h4::text').extract(),
                    }
      yield project_dic
    elif has_regex(response.url, userpage_re):
      profile = response.css('#profile-data')
      if profile is not None:
        profile_dic = {'username': profile.css('h2::text').extract_first(),
                          'details': profile.css('.profile-details::text').extract_first(),
                          'counts': response.css('.box-head h4::text')[0:4].extract()
                         }
        yield profile_dic

    # save the page contents
    # filename = f'quotes-{response.url}.html'
    # with open(filename, 'wb') as f:
    #   f.write(response.body)

    # follow interesting links
    for next_page in response.css('a::attr(href)'):
      if next_page is not None:
        next_page = next_page.extract()
        if is_interesting(next_page):
          yield response.follow(next_page, meta={'download_timeout': 20})




if __name__ == '__main__':
  isit = is_interesting('// https://scratch.mit.edu/users/USERNAME/foallowers/ ')
  print(isit)
