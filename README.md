# News Sentiment Analyzer

A full-stack application that aggregates news articles using a keyword search, then performs sentiment analysis using natural language processing (NLP). It combines aggregation, and web scraping to deliver top headlines, links, and sentiment insights across many topics in real time.

### Features
- News aggregation related to user inputted keywords, retreiving top headlines with links.
- Summarization of articles for users to quickly gain information
- Real time sentiment analysis with a rating and score for users to understand the current situation.
- Search by category or query for specific articles
- Users can get articles about categories and queries like markets, sectors, and more.
- An interative dashboard to explore news and sentiment ratings


### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/VedPeesu/NewsAggregatorSentimentAnalysis.git
   cd NewsAggregatorSentimentAnalysis
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Set up News API credentials**
   - Go to [News API](https://newsapi.org/) and create a free account
   - Generate your API key
   - Create a `.env` file in the project root:
     ```bash
     cp env_example.txt .env
     ```
   - Edit `.env` and add your API key:
     ```
     NEWS_API_KEY=your_actual_api_key_here
     ```

4. **Run the application**
   ```bash
   python app.py
   ```