from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from main import NewsAPIClient
from analysis import analyze_article
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

NEWS_API_KEY = os.getenv('NEWS_API_KEY', '')
news_client = NewsAPIClient(NEWS_API_KEY)

@app.route('/')
def index():
    """Main page route"""
    return render_template('index.html')

@app.route('/api/articles/category', methods=['POST'])
def get_articles_by_category():
    """API endpoint to get articles by category"""
    try:
        data = request.get_json()
        category = data.get('category', 'general')
        
        if not NEWS_API_KEY:
            return jsonify({'error': 'News API key not configured'}), 400
        
        articles = news_client.get_articles_by_category(category)
        return jsonify({'articles': articles, 'category': category})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/articles/query', methods=['POST'])
def get_articles_by_query():
    """API endpoint to get articles by query"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        
        if not query:
            return jsonify({'error': 'Query parameter is required'}), 400
        
        if not NEWS_API_KEY:
            return jsonify({'error': 'News API key not configured'}), 400
        
        articles = news_client.get_articles_by_query(query)
        return jsonify({'articles': articles, 'query': query})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_article_endpoint():
    """API endpoint to analyze article sentiment"""
    try:
        data = request.get_json()
        url = data.get('url', '')
        
        if not url:
            return jsonify({'error': 'URL parameter is required'}), 400
        from analysis import analyze_article
        
        def analyze_article_for_api(url):
            from newspaper import Article
            from textblob import TextBlob
            import nltk
            
            try:
                nltk.download('punkt', quiet=True)
                
                article = Article(url)
                article.download()
                article.parse()
                article.nlp()

                blob = TextBlob(article.text)
                sentiment_score = blob.polarity

                if sentiment_score > 0:
                    sentiment = 'positive'
                elif sentiment_score < 0:
                    sentiment = 'negative'
                else:
                    sentiment = 'neutral'

                return {
                    'title': article.title,
                    'authors': article.authors,
                    'publish_date': str(article.publish_date) if article.publish_date else None,
                    'summary': article.summary,
                    'sentiment_score': sentiment_score,
                    'sentiment': sentiment,
                    'url': url
                }
            except Exception as e:
                return {'error': 'Failed to analyze article: {}'.format(str(e))}
        
        result = analyze_article_for_api(url)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories')
def get_categories():
    """API endpoint to get available news categories"""
    categories = [
        'business', 'entertainment', 'general', 'health', 'science', 
        'sports', 'technology'
    ]
    return jsonify({'categories': categories})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 