import anthropic
from rest_framework import status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from . import ai,notify
from .serializers import ChatRequestSerializer, EnquirySerializer


class EnquiryCreateView(APIView):
    """POST /api/enquiries/ - save a contact-form enquiry, then let Claude triage it."""

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "enquiry"

    def post(self, request):
        serializer = EnquirySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        enquiry = serializer.save()
        ai.run_enquiry_analysis(enquiry)
        notify.notify_owner(enquiry)  # best effort, never blocks the visitor
        return Response(
            {"detail": "Thank you! Your enquiry has been received. We will contact you soon."},
            status=status.HTTP_201_CREATED,
        )


class ChatView(APIView):
    """POST /api/chat/ - answer a visitor's question with Claude."""

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "chat"

    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        messages = [
            {"role": m["role"], "content": m["content"]}
            for m in serializer.validated_data["messages"]
        ]
        try:
            reply = ai.chat_reply(messages)
        except ai.AIUnavailable:
            return Response(
                {"detail": "The assistant is not available right now. Please call 77 3600 8486."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except anthropic.APIError as exc:
            print("CLAUDE ERROR:", exc)
            return Response(
                {"detail": "The assistant could not answer just now. Please try again or call 77 3600 8486."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        return Response({"reply": reply or "Please call 77 3600 8486 and we will be happy to help."})
