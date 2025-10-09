from . import __version__ as app_version

app_name = "azab_shop"
app_title = "Azab Shop"
app_publisher = "Azab Solutions"
app_description = "Property Management and Maintenance System"
app_email = "admin@azabsolutions.com"
app_license = "MIT"

# Includes in <head>
app_include_css = "/assets/azab_shop/dist/assets/index.css"
app_include_js = "/assets/azab_shop/dist/assets/index.js"

# Website includes
web_include_css = "/assets/azab_shop/css/azab_shop.css"
web_include_js = "/assets/azab_shop/js/azab_dashboard.js"

# Website routes - React SPA routing
website_route_rules = [
    {"from_route": "/dashboard", "to_route": "azab_dashboard"},
    {"from_route": "/app/<path:app_path>", "to_route": "azab_dashboard"},
    {"from_route": "/properties/<path:app_path>", "to_route": "azab_dashboard"},
    {"from_route": "/requests/<path:app_path>", "to_route": "azab_dashboard"},
    {"from_route": "/vendors/<path:app_path>", "to_route": "azab_dashboard"},
    {"from_route": "/reports/<path:app_path>", "to_route": "azab_dashboard"},
    {"from_route": "/settings/<path:app_path>", "to_route": "azab_dashboard"},
]

# Override home page
home_page = "azab_dashboard"

# Standard portal menu items
standard_portal_menu_items = [
    {"title": "لوحة التحكم", "route": "/dashboard", "reference_doctype": "", "role": ""},
    {"title": "العقارات", "route": "/properties", "reference_doctype": "", "role": ""},
    {"title": "الصيانة", "route": "/requests", "reference_doctype": "", "role": ""},
    {"title": "الموردين", "route": "/vendors", "reference_doctype": "", "role": ""},
    {"title": "التقارير", "route": "/reports", "reference_doctype": "", "role": ""},
]

# User permissions
has_website_permission = {
    "Property": "azab_shop.permissions.has_website_permission",
}

# API whitelist
override_whitelisted_methods = {
    "azab_shop.api.get_properties": "azab_shop.api.get_properties",
    "azab_shop.api.get_maintenance_requests": "azab_shop.api.get_maintenance_requests",
}
