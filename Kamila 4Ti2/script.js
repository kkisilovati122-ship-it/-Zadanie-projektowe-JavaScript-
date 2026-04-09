const servicesData = [
    { id: 's1', name: 'Strona wizytówka', price: 1200 },
    { id: 's2', name: 'Sklep internetowy', price: 4500 },
    { id: 's3', name: 'Optymalizacja SEO', price: 800 },
    { id: 's4', name: 'Identyfikacja wizualna (Logo)', price: 1500 },
    { id: 's5', name: 'Hosting (1 rok)', price: 300 }
];

class Quote {
    constructor(clientName, services, priorityMultiplier, total) {
        this.id = Date.now();
        this.clientName = clientName;
        this.services = services;
        this.priorityMultiplier = priorityMultiplier;
        this.total = total;
        this.date = new Date().toLocaleDateString();
    }
}

class App {
    constructor() {
        this.form = document.getElementById('quote-form');
        this.servicesContainer = document.getElementById('services-container');
        this.totalPriceEl = document.getElementById('total-price');
        this.prioritySelect = document.getElementById('priority');
        this.quotesList = document.getElementById('quotes-list');
        this.clearBtn = document.getElementById('clear-history');
        this.searchInput = document.querySelector('#search-input');
        this.quotes = this.loadData();

        this.init();
    }

    init() {
        this.renderServices();
        this.renderQuotes(this.quotes);
        this.addEventListeners();
    }

    renderServices() {
        servicesData.forEach(service => {
            const div = document.createElement('div');
            div.className = 'service-item';
            
            div.innerHTML = `
                <label>
                    <input type="checkbox" class="service-checkbox" value="${service.price}" data-name="${service.name}">
                    ${service.name}
                </label>
                <span>${service.price} PLN</span>
            `;
            this.servicesContainer.appendChild(div);
        });
    }

    addEventListeners() {
        this.form.addEventListener('change', () => this.calculateTotal());
        
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        this.clearBtn.addEventListener('click', () => this.clearHistory());

        this.searchInput.addEventListener('input', (e) => this.filterQuotes(e.target.value));
    }

    calculateTotal() {
        let total = 0;
        
        const serviceItems = document.getElementsByClassName('service-item');
        
        for(let item of serviceItems) {
            const checkbox = item.querySelector('.service-checkbox');
            if(checkbox.checked) {
                total += parseFloat(checkbox.value);
            }
        }

        const priorityMultiplier = parseFloat(this.prioritySelect.value);
        total = total * priorityMultiplier;

        this.totalPriceEl.textContent = total.toFixed(2);
        return total;
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const clientName = document.getElementById('client-name').value.trim();
        const total = this.calculateTotal();

        if(clientName === "" || total === 0) {
            alert("Podaj nazwę klienta i wybierz przynajmniej jedną usługę!");
            return;
        }

        const selectedServices = [];
        const checkboxes = document.querySelectorAll('.service-checkbox:checked');
        checkboxes.forEach(cb => selectedServices.push(cb.getAttribute('data-name')));

        const newQuote = new Quote(clientName, selectedServices, this.prioritySelect.value, total);
        
        this.quotes.push(newQuote);
        this.saveData();
        this.renderQuotes(this.quotes);
        
        this.form.reset();
        this.calculateTotal();
    }

    renderQuotes(quotesToRender) {
        this.quotesList.innerHTML = '';
        
        if(quotesToRender.length === 0) {
            this.quotesList.innerHTML = '<p>Brak zapisanych wycen.</p>';
            return;
        }

        quotesToRender.forEach(quote => {
            const li = document.createElement('li');
            li.className = 'quote-card';
            li.innerHTML = `
                <strong>Klient:</strong> ${quote.clientName} <br>
                <small><strong>Data:</strong> ${quote.date} | <strong>Usługi:</strong> ${quote.services.join(', ')}</small> <br>
                <strong style="color: #2563eb;">Razem: ${quote.total.toFixed(2)} PLN</strong>
            `;
            this.quotesList.appendChild(li);
        });
    }

    filterQuotes(searchTerm) {
        const term = searchTerm.toLowerCase();
        const filtered = this.quotes.filter(q => q.clientName.toLowerCase().includes(term));
        this.renderQuotes(filtered);
    }

    saveData() {
        localStorage.setItem('savedQuotes', JSON.stringify(this.quotes));
    }

    loadData() {
        const data = localStorage.getItem('savedQuotes');
        return data ? JSON.parse(data) : [];
    }

    clearHistory() {
        if(confirm("Czy na pewno chcesz usunąć całą historię?")) {
            this.quotes = [];
            this.saveData();
            this.renderQuotes(this.quotes);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});