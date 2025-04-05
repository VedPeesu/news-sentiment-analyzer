import requests
from bs4 import BeautifulSoup

NEWS_API_KEY = ''
NEWS_API_BASE_URL = 'https://newsapi.org/v2'

class NewsAPIClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = NEWS_API_BASE_URL

    def retrieve_articles(self, endpoint, params):
        response = requests.get(self.base_url + endpoint, params=params)
        
        print("Request URL:", response.url)
        print("Request Parameters:", params)
        
        if response.status_code == 200:
            articles = response.json().get('articles', [])
            results = [{"title": article["title"], "url": article["url"]} for article in articles]
            return results
        else:
            print("Error retrieving articles:", response.status_code)
            print("Response Text:", response.text) 
            return []