import unittest
from unittest.mock import patch, MagicMock
from main import NewsAPIClient
import requests
from main import NewsAggregator


class NewsAPIClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://newsapi.org/v2'

    def retrieve_articles(self, endpoint, params):
        response = requests.get(self.base_url + endpoint, params=params)
        
        print("Request URL:", response.url)
        print("Request Parameters:", params)
        
        try:
            articles = response.json().get('articles', [])
            if articles:
                results = [{"title": article["title"], "url": article["url"]} for article in articles]
                return results
            else:
                print("No articles found.")
                return []
        except ValueError as e:
            print("Error parsing response JSON:", e)
            return []


class TestNewsAggregator(unittest.TestCase):
    @patch('builtins.input', return_value='Business')
    @patch('main.NewsAPIClient.get_articles_by_category')
    def test_get_articles_by_category_action(self, mock_get_articles, mock_input):
        mock_get_articles.return_value = [{'title': 'Test Title 1', 'url': 'http://example.com/1'}]
        
        mock_news_client = MagicMock()
        mock_news_client.get_articles_by_category = mock_get_articles
        
        aggregator = NewsAggregator(news_client=mock_news_client)
        
        with patch('builtins.print') as mocked_print:
            aggregator.get_articles_by_category_action()
            
            mocked_print.assert_any_call("Retrieving news for Business...\n")
            mocked_print.assert_any_call('Title: Test Title 1')
            mocked_print.assert_any_call('URL: http://example.com/1')
if __name__ == '__main__':
    unittest.main()