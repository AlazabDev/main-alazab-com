frappe.pages['alazab-dashboard'] = {
    title: 'Property Management Dashboard',
    single_page: true,
    route: 'alazab-dashboard',
    onload: function(wrapper) {
        // The React app is loaded via the HTML template
        // This file ensures the page is registered in Frappe
        console.log('Alazab Dashboard page loaded');
    }
};

// Initialize React app when document is ready
document.addEventListener('DOMContentLoaded', function() {
    const appContainer = document.getElementById('alazab-react-app');
    if (appContainer && window.AlazabApp) {
        window.AlazabApp.render(appContainer);
    }
});
