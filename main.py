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

    def get_articles_by_category(self, category):
        params = {
            "category": category,
            "sortBy": "top",
            "country": "us",
            "apiKey": self.api_key
        }
        return self.retrieve_articles('/top-headlines', params)

    def get_articles_by_query(self, query):
        params = {
            "q": query,
            "sortBy": "top",
            "apiKey": self.api_key
        }
        return self.retrieve_articles('/everything', params)

    def get_sources_by_category(self, category):
        params = {
            "category": category,
            "language": "en",
            "apiKey": self.api_key
        }
        return self.retrieve_articles('/top-headlines/sources', params)
    
class NewsAggregator:
    def __init__(self, news_client):
        self.news_client = news_client

    def display_results(self, results):
        if results:
            for result in results:
                print(f"Title: {result['title']}")
                if 'url' in result:
                    print(f"URL: {result['url']}")
                print('')
        else:
            print("No results found.")

    def get_articles_by_category_action(self):
        category = input("Enter the category (e.g., Business, Technology): ")
        print(f"Retrieving news for {category}...\n")
        results = self.news_client.get_articles_by_category(category)
        self.display_results(results)
        print(f"Top {category} headlines")

    def get_articles_by_query_action(self):
        query = input("Enter the query (e.g., Bitcoin, Stock market): ")
        print(f"Retrieving news for query '{query}'...\n")
        results = self.news_client.get_articles_by_query(query)
        self.display_results(results)
        print(f"Top headlines for '{query}'")

    def get_sources_by_category_action(self):
        category = input("Enter the category (e.g., Business, Technology): ")
        print(f"Retrieving sources for {category}...\n")
        results = self.news_client.get_sources_by_category(category)
        self.display_results(results)
        print(f"Sources for {category}")

    def exit_program_action(self):
        print("Exiting the program.")
        exit() 

    def run(self):
        actions = {
            '1': self.get_articles_by_category_action,
            '2': self.get_articles_by_query_action,
            '3': self.get_sources_by_category_action,
            '4': self.exit_program_action,
        }

        while True:
            print("\nChoose an option:")
            print("1. Get articles by category")
            print("2. Get articles by query")
            print("3. Get sources by category")
            print("4. Exit")

            choice = input("Enter the number of your choice: ")

            action = actions.get(choice)
            if action:
                action()
            else:
                print("Invalid choice. Please enter a number between 1 and 4.")

if __name__ == "__main__":
    news_client = NewsAPIClient(api_key=NEWS_API_KEY)
    aggregator = NewsAggregator(news_client)
    aggregator.run()