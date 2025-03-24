import tkinter as tk
from textblob import TextBlob
from newspaper import Article
import nltk

nltk.download('punkt')

def analyze_article(url):
    article = Article(url)
    article.download()
    article.parse()
    article.nlp()

    print(f'\nTitle: {article.title}\n')
    print(f'Authors: {article.authors}\n')
    print(f'Published On: {article.publish_date}\n')
    print(f'Summary:\n{article.summary}\n')

    blob = TextBlob(article.text)
    sentiment_score = blob.polarity

    if sentiment_score > 0:
        sentiment = 'positive'
    elif sentiment_score < 0:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'

    print(f'Sentiment Score: {sentiment_score:.4f}\n')
    print(f'Sentiment: {sentiment}\n')

def main():
    url = input("Enter the URL of the article you want to analyze: ")
    analyze_article(url)

if __name__ == "__main__":
    main()