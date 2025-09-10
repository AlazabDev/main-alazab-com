from . import __version__ as app_version

app_name = "azab_shop_revive"
app_title = "Azab Shop Revive"
app_publisher = "Azab Solutions"
app_description = "Property Management and Maintenance System"
app_email = "admin@azabsolutions.com"
app_license = "MIT"

# Includes in <head>
app_include_css = "/assets/azab_shop_revive/dist/index.css"
app_include_js = "/assets/azab_shop_revive/dist/index.js"

# Website includes
web_include_css = "/assets/azab_shop_revive/css/azab_shop_revive.css"
web_include_js = "/assets/azab_shop_revive/js/azab_dashboard.js"

# Website routes
website_route_rules = [
	{"from_route": "/dashboard", "to_route": "azab_dashboard"},
	{"from_route": "/app", "to_route": "azab_dashboard"},
	{"from_route": "/properties", "to_route": "azab_dashboard"},
	{"from_route": "/requests", "to_route": "azab_dashboard"},
	{"from_route": "/vendors", "to_route": "azab_dashboard"},
	{"from_route": "/reports", "to_route": "azab_dashboard"},
]

# Override home page
home_page = "azab_dashboard"

# Standard website pages
standard_portal_menu_items = [
	{"title": "Dashboard", "route": "/dashboard", "reference_doctype": "", "role": ""},
	{"title": "Properties", "route": "/properties", "reference_doctype": "", "role": ""},
	{"title": "Maintenance", "route": "/requests", "reference_doctype": "", "role": ""},
	{"title": "Vendors", "route": "/vendors", "reference_doctype": "", "role": ""},
	{"title": "Reports", "route": "/reports", "reference_doctype": "", "role": ""},
]

# User permissions
has_website_permission = {
	"Property": "azab_shop_revive.permissions.has_website_permission",
}

# API whitelist
override_whitelisted_methods = {
	"azab_shop_revive.api.get_properties": "azab_shop_revive.api.get_properties",
	"azab_shop_revive.api.get_maintenance_requests": "azab_shop_revive.api.get_maintenance_requests",
}