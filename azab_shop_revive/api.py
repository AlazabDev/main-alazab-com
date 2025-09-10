import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_properties():
	"""Get all properties for current user"""
	try:
		# For now, return mock data - integrate with your Supabase later
		return {
			"status": "success",
			"data": [
				{
					"id": "1",
					"name": "Property 1",
					"address": "123 Main St",
					"type": "Residential"
				}
			]
		}
	except Exception as e:
		frappe.log_error(f"Error getting properties: {str(e)}")
		return {"status": "error", "message": str(e)}

@frappe.whitelist(allow_guest=True)
def get_maintenance_requests():
	"""Get maintenance requests"""
	try:
		return {
			"status": "success",
			"data": []
		}
	except Exception as e:
		frappe.log_error(f"Error getting maintenance requests: {str(e)}")
		return {"status": "error", "message": str(e)}