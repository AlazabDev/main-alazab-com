import frappe

def get_context(context):
    """Set page context for Frappe"""
    context.no_cache = 1
    context.title = "Property Management Dashboard"
    context.show_sidebar = False
    context.full_width = True
    
    # Add user information
    if frappe.session.user != "Guest":
        context.user_info = {
            "name": frappe.session.user,
            "full_name": frappe.db.get_value("User", frappe.session.user, "full_name"),
            "email": frappe.session.user,
            "user_image": frappe.db.get_value("User", frappe.session.user, "user_image"),
        }
    else:
        context.user_info = {
            "name": "Guest",
            "full_name": "Guest User",
            "email": "",
        }
    
    return context
