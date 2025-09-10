def get_context(context):
	# Set page context for Frappe
	context.title = "Property Management Dashboard"
	context.show_sidebar = False
	context.full_width = True
	
	# Add any server-side data needed by React app
	context.api_key = frappe.get_single("System Settings").api_key or ""
	context.user_info = {
		"name": frappe.session.user,
		"full_name": frappe.db.get_value("User", frappe.session.user, "full_name"),
		"email": frappe.session.user
	}