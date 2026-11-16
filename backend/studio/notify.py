import json
import urllib.request

from django.conf import settings
from django.core.mail import EmailMessage


def notify_owner(enquiry):
    """Email the studio owner about a new enquiry. Never raises."""
    if not settings.OWNER_EMAIL:
        return

    ai = f"\n\nSummary: {enquiry.ai_summary}\nPriority: {enquiry.ai_priority}" if enquiry.ai_summary else ""
    text = (
        "New enquiry from the STRUCTURE website\n\n"
        f"Name: {enquiry.name}\nPhone: {enquiry.phone or '-'}\nEmail: {enquiry.email}\n"
        f"Project type: {enquiry.project_type}\n\nMessage:\n{enquiry.message}{ai}"
    )
    subject = f"New enquiry from {enquiry.name}"

    if settings.RESEND_API_KEY:
        try:
            req = urllib.request.Request(
                "https://api.resend.com/emails",
                data=json.dumps({
                    "from": "STRUCTURE Website <onboarding@resend.dev>",
                    "to": [settings.OWNER_EMAIL],
                    "subject": subject,
                    "text": text,
                    "reply_to": enquiry.email,
                }).encode(),
                headers={
                    "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                    "Content-Type": "application/json",
                    "User-Agent": "structure-website/1.0",
                },
                method="POST",
            )
            urllib.request.urlopen(req, timeout=15)
        except Exception as exc:
            print("EMAIL ERROR:", exc)
    else:
        try:
            EmailMessage(
                subject=subject,
                body=text,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.OWNER_EMAIL],
                reply_to=[enquiry.email],
            ).send()
        except Exception as exc:
            print("EMAIL ERROR:", exc)