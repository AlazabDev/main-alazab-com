import frappe

def has_website_permission(doc, ptype, user, verbose=False):
	"""Check if user has permission to access website content"""
	if ptype == "read":
		return True
	return False