from django.urls import path

from .views import ChatView, EnquiryCreateView

urlpatterns = [
    path("enquiries/", EnquiryCreateView.as_view(), name="enquiry-create"),
    path("chat/", ChatView.as_view(), name="chat"),
]
