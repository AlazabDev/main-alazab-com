import frappe

def has_website_permission(doc, ptype, user, verbose=False):
    """
    Custom permission check for website access
    """
    if not user:
        user = frappe.session.user
    
    # Allow guest users to view public data
    if user == "Guest":
        return False
    
    # Admin has access to everything
    if user == "Administrator":
        return True
    
    # Check if user has the appropriate role
    if frappe.has_permission(doc.doctype, ptype, doc, user=user):
        return True
    
    return False
