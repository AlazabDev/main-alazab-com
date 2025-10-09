frappe.pages['azab-dashboard'] = {
    title: 'لوحة تحكم العقارات',
    single_page: true,
    route: 'azab-dashboard',
    onload: function(wrapper) {
        // The React app is loaded via the HTML template
        // This file ensures the page is registered in Frappe
        console.log('Azab Dashboard page loaded');
    }
};

// Initialize React app when document is ready
document.addEventListener('DOMContentLoaded', function() {
    const appContainer = document.getElementById('azab-react-app');
    if (appContainer && window.AzabApp) {
        window.AzabApp.render(appContainer);
    }
});
