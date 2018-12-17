# -*- coding: utf-8 -*-
import scrapy


# class RawSpider(scrapy.Spider):
#     name = 'raw'
#     allowed_domains = ['scratch.mit.edu']
#     start_urls = ['http://scratch.mit.edu/']

#     def parse(self, response):
#         pass

class RawSpider(scrapy.Spider):
  name = 'raw'
  allowed_domains = ['scratch.mit.edu']
  start_urls = ['https://scratch.mit.edu/projects/269873985/']

  def parse(self, response):
    for user in response.css('ul li .title a::text'):
      yield {'username': user.extract()}

    # filename = f'quotes-{response.url}.html'
    # with open(filename, 'wb') as f:
    #   f.write(response.body)

    for next_page in response.css('a::attr(href)'):
      if next_page is not None:
        yield response.follow(next_page, self.parse)
