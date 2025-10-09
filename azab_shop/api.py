import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_properties():
    """Get all properties for current user"""
    try:
        # Integration with Supabase - return structure compatible with frontend
        return {
            "status": "success",
            "data": [],
            "message": _("تم تحميل العقارات بنجاح")
        }
    except Exception as e:
        frappe.log_error(f"Error getting properties: {str(e)}", "API Error")
        return {"status": "error", "message": str(e)}

@frappe.whitelist(allow_guest=True)
def get_maintenance_requests():
    """Get maintenance requests"""
    try:
        # Integration with Supabase - return structure compatible with frontend
        return {
            "status": "success",
            "data": [],
            "message": _("تم تحميل طلبات الصيانة بنجاح")
        }
    except Exception as e:
        frappe.log_error(f"Error getting maintenance requests: {str(e)}", "API Error")
        return {"status": "error", "message": str(e)}

@frappe.whitelist()
def get_user_profile():
    """Get current user profile information"""
    try:
        user = frappe.session.user
        user_doc = frappe.get_doc("User", user)
        
        return {
            "status": "success",
            "data": {
                "name": user,
                "full_name": user_doc.full_name,
                "email": user_doc.email,
                "user_image": user_doc.user_image,
            }
        }
    except Exception as e:
        frappe.log_error(f"Error getting user profile: {str(e)}", "API Error")
        return {"status": "error", "message": str(e)}
