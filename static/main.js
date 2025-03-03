class NewsAggregatorApp {
    constructor() {
        this.baseUrl = window.location.origin;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('queryInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchByQuery();
            }
        });

        document.getElementById('categorySelect').addEventListener('change', (e) => {
            if (e.target.value) {
                searchByCategory();
            }
        });
    }

    showLoading() {
        document.getElementById('loadingSpinner').classList.remove('d-none');
        document.getElementById('resultsSection').classList.add('d-none');
    }

    hideLoading() {
        document.getElementById('loadingSpinner').classList.add('d-none');
    }

    showResults() {
        document.getElementById('resultsSection').classList.remove('d-none');
    }

    clearResults() {
        document.getElementById('resultsSection').classList.add('d-none');
        document.getElementById('articlesContainer').innerHTML = '';
        document.getElementById('resultsTitle').textContent = 'Search Results';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>${message}`;
        
        const container = document.getElementById('articlesContainer');
        container.innerHTML = '';
        container.appendChild(errorDiv);
        this.showResults();
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `<i class="fas fa-check-circle me-2"></i>${message}`;
        
        const container = document.getElementById('articlesContainer');
        container.appendChild(successDiv);
    }

    async makeRequest(url, data = null) {
        try {
            const options = {
                method: data ? 'POST' : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            if (data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'An error occurred');
            }

            return result;
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    }

    async searchByCategory() {
        const category = document.getElementById('categorySelect').value;
        
        if (!category) {
            this.showError('Please select a category');
            return;
        }

        this.showLoading();

        try {
            const result = await this.makeRequest(`${this.baseUrl}/api/articles/category`, {
                category: category
            });

            this.displayArticles(result.articles, `Top ${category.charAt(0).toUpperCase() + category.slice(1)} Headlines`);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    async searchByQuery() {
        const query = document.getElementById('queryInput').value.trim();
        
        if (!query) {
            this.showError('Please enter a search query');
            return;
        }

        this.showLoading();

        try {
            const result = await this.makeRequest(`${this.baseUrl}/api/articles/query`, {
                query: query
            });

            this.displayArticles(result.articles, `Search Results for "${query}"`);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    displayArticles(articles, title) {
        const container = document.getElementById('articlesContainer');
        const resultsTitle = document.getElementById('resultsTitle');

        if (!articles || articles.length === 0) {
            container.innerHTML = '<div class="text-center text-muted"><i class="fas fa-newspaper fa-3x mb-3"></i><p>No articles found</p></div>';
            resultsTitle.textContent = title;
            this.showResults();
            return;
        }

        resultsTitle.textContent = title;
        
        const articlesHTML = articles.map((article, index) => `
            <div class="article-card">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h6 class="article-title">
                            <a href="${article.url}" target="_blank" class="text-decoration-none">
                                ${article.title || 'No title available'}
                            </a>
                        </h6>
                        <p class="article-url mb-2">
                            <i class="fas fa-link me-1"></i>
                            <a href="${article.url}" target="_blank" class="text-decoration-none">
                                ${this.truncateUrl(article.url)}
                            </a>
                        </p>
                    </div>
                    <div class="ms-3">
                        <button class="btn btn-outline-primary btn-sm" onclick="analyzeSentiment('${article.url}')">
                            <i class="fas fa-chart-line me-1"></i>Analyze
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = articlesHTML;
        this.showResults();
    }

    truncateUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname + urlObj.pathname.substring(0, 50) + (urlObj.pathname.length > 50 ? '...' : '');
        } catch {
            return url.substring(0, 50) + (url.length > 50 ? '...' : '');
        }
    }

    async analyzeSentiment(url) {
        const modal = new bootstrap.Modal(document.getElementById('sentimentModal'));
        modal.show();

        document.getElementById('sentimentLoading').classList.remove('d-none');
        document.getElementById('sentimentResults').classList.add('d-none');

        try {
            const result = await this.makeRequest(`${this.baseUrl}/api/analyze`, {
                url: url
            });

            if (result.error) {
                throw new Error(result.error);
            }

            this.displaySentimentResults(result);
        } catch (error) {
            this.displaySentimentError(error.message);
        }
    }

    displaySentimentResults(data) {
        document.getElementById('sentimentLoading').classList.add('d-none');
        document.getElementById('sentimentResults').classList.remove('d-none');
        document.getElementById('articleTitle').textContent = data.title || 'No title available';
        document.getElementById('articleAuthors').textContent = data.authors ? `By: ${data.authors.join(', ')}` : 'Author not available';
        document.getElementById('articleDate').textContent = data.publish_date ? `Published: ${new Date(data.publish_date).toLocaleDateString()}` : 'Date not available';
        document.getElementById('articleSummary').textContent = data.summary || 'No summary available';

        const scoreElement = document.getElementById('sentimentScore');
        const labelElement = document.getElementById('sentimentLabel');

        scoreElement.textContent = (data.sentiment_score * 100).toFixed(1) + '%';
        labelElement.textContent = data.sentiment.charAt(0).toUpperCase() + data.sentiment.slice(1);

        labelElement.className = `badge fs-6 sentiment-${data.sentiment}`;
        scoreElement.className = `sentiment-score sentiment-${data.sentiment}`;
    }

    displaySentimentError(message) {
        document.getElementById('sentimentLoading').classList.add('d-none');
        document.getElementById('sentimentResults').classList.remove('d-none');

        document.getElementById('articleTitle').textContent = 'Analysis Failed';
        document.getElementById('articleAuthors').textContent = '';
        document.getElementById('articleDate').textContent = '';
        document.getElementById('articleSummary').textContent = message;

        document.getElementById('sentimentScore').textContent = 'N/A';
        document.getElementById('sentimentLabel').textContent = 'Error';
        document.getElementById('sentimentLabel').className = 'badge fs-6 bg-danger';
    }
}
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new NewsAggregatorApp();
});

function searchByCategory() {
    app.searchByCategory();
}

function searchByQuery() {
    app.searchByQuery();
}

function clearResults() {
    app.clearResults();
}

function analyzeSentiment(url) {
    app.analyzeSentiment(url);
} 