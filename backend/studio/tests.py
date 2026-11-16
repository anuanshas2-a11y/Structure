from unittest.mock import patch

from django.core.cache import cache
from django.test import override_settings
from rest_framework.test import APITestCase

from .models import Enquiry

VALID = {
    "name": "Ravi",
    "email": "ravi@example.com",
    "phone": "9999999999",
    "project_type": "Interior Design",
    "message": "I want to redesign my living room.",
}


@override_settings(ANTHROPIC_API_KEY="")
class EnquiryTests(APITestCase):
    def setUp(self):
        cache.clear()

    def test_enquiry_saved_even_without_ai(self):
        res = self.client.post("/api/enquiries/", VALID, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertEqual(Enquiry.objects.count(), 1)
        self.assertEqual(Enquiry.objects.first().ai_summary, "")

    def test_enquiry_validation(self):
        res = self.client.post("/api/enquiries/", {**VALID, "email": "bad"}, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertEqual(Enquiry.objects.count(), 0)

    @patch("studio.ai.analyse_enquiry")
    def test_ai_fields_saved(self, mock_analyse):
        mock_analyse.return_value = {"summary": "Wants living room redesign", "priority": "high", "reply_draft": "Hi Ravi"}
        self.client.post("/api/enquiries/", VALID, format="json")
        e = Enquiry.objects.first()
        self.assertEqual(e.ai_priority, "high")
        self.assertEqual(e.ai_reply_draft, "Hi Ravi")


class ChatTests(APITestCase):
    def setUp(self):
        cache.clear()

    @override_settings(ANTHROPIC_API_KEY="")
    def test_chat_without_key_returns_503(self):
        res = self.client.post("/api/chat/", {"messages": [{"role": "user", "content": "Hi"}]}, format="json")
        self.assertEqual(res.status_code, 503)

    @patch("studio.ai.chat_reply", return_value="We offer interior design.")
    def test_chat_ok(self, _):
        res = self.client.post("/api/chat/", {"messages": [{"role": "user", "content": "Services?"}]}, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["reply"], "We offer interior design.")

    def test_chat_last_message_must_be_user(self):
        res = self.client.post("/api/chat/", {"messages": [{"role": "assistant", "content": "Hello"}]}, format="json")
        self.assertEqual(res.status_code, 400)
