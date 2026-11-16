from django.contrib import admin, messages

from . import ai
from .models import Enquiry


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "project_type", "email", "phone", "ai_priority", "status", "created_at")
    list_filter = ("status", "ai_priority", "project_type")
    search_fields = ("name", "email", "phone", "message")
    list_editable = ("status",)
    readonly_fields = ("created_at", "ai_summary", "ai_priority", "ai_reply_draft")
    actions = ["rerun_ai"]

    @admin.action(description="Re-run Claude analysis on selected enquiries")
    def rerun_ai(self, request, queryset):
        done = sum(1 for e in queryset if ai.run_enquiry_analysis(e))
        level = messages.SUCCESS if done else messages.WARNING
        self.message_user(request, f"Claude analysed {done} of {queryset.count()} enquiries.", level)
