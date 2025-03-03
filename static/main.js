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
}