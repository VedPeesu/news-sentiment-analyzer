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