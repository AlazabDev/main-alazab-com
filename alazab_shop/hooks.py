from . import __version__ as app_version

app_name = "alazab_shop"
app_title = "Alazab Shop"
app_publisher = "Alazab Solutions"
app_description = "Property Management and Maintenance System"
app_email = "alazab.architecture@outlook.com"
app_license = "MIT"

# Includes in <head>
app_include_css = "/assets/alazab_shop/dist/assets/index.css"
app_include_js = "/assets/alazab_shop/dist/assets/index.js"

# Website includes
web_include_css = "/assets/alazab_shop/css/alazab_shop.css"
web_include_js = "/assets/alazab_shop/js/alazab_dashboard.js"

# Website routes - React SPA routing
website_route_rules = [
    {"from_route": "/dashboard", "to_route": "alazab_dashboard"},
    {"from_route": "/app/<path:app_path>", "to_route": "alazab_dashboard"},
    {"from_route": "/properties/<path:app_path>", "to_route": "alazab_dashboard"},
    {"from_route": "/requests/<path:app_path>", "to_route": "alazab_dashboard"},
    {"from_route": "/vendors/<path:app_path>", "to_route": "alazab_dashboard"},
    {"from_route": "/reports/<path:app_path>", "to_route": "alazab_dashboard"},
    {"from_route": "/settings/<path:app_path>", "to_route": "alazab_dashboard"},
]

# Override home page
home_page = "alazab_dashboard"

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
    "Property": "alazab_shop.permissions.has_website_permission",
}

# API whitelist
override_whitelisted_methods = {
    "alazab_shop.api.get_properties": "alazab_shop.api.get_properties",
    "alazab_shop.api.get_maintenance_requests": "alazab_shop.api.get_maintenance_requests",
}

# Boot session
# -----------------
# Execute on login/boot
# boot_session = "alazab_shop.boot.boot_session"

# Fixtures
# --------
# List of fixtures
# fixtures = []

# Document Events
# ---------------
# Hook on document methods and events
# doc_events = {
#     "*": {
#         "on_update": "method",
#         "on_cancel": "method",
#         "on_trash": "method"
#     }
# }

# Scheduled Tasks
# ---------------
# scheduler_events = {
#     "all": [
#         "alazab_shop.tasks.all"
#     ],
#     "daily": [
#         "alazab_shop.tasks.daily"
#     ],
# }

# Testing
# -------
# before_tests = "alazab_shop.install.before_tests"

# Overriding Methods
# ------------------------------
# override_whitelisted_methods = {
#     "frappe.desk.doctype.event.event.get_events": "alazab_shop.event.get_events"
# }
