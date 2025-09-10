frappe.pages['azab-dashboard'] = {
	title: 'Property Management Dashboard',
	single_page: true,
	route: 'azab-dashboard',
	onload: function() {
		// Load React app
		const appContainer = document.createElement('div');
		appContainer.id = 'azab-react-app';
		document.querySelector('.page-content').appendChild(appContainer);
		
		// Load CSS
		frappe.require('/assets/azab_shop_revive/dist/index.css');
		
		// Load JS
		frappe.require('/assets/azab_shop_revive/dist/index.js').then(() => {
			// Initialize React app
			if (window.AzabApp) {
				window.AzabApp.render(appContainer);
			}
		});
	}
};