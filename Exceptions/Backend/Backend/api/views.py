from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from items.models import Item
from .serializers import ItemSerializer
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.urls import reverse
from qr_code.qrcode.utils import QRCodeOptions
from qr_code.qrcode.maker import make_qr
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom authentication class to extract JWT token from cookies.
    """

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            access_token = request.COOKIES.get('access_token')
            if access_token:
                request.headers['Authorization'] = f'Bearer {access_token}'

        return super().authenticate(request)


class LostItemCreateAPIView(generics.CreateAPIView):
    """
    API to report a lost item. Requires authentication.
    """
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user, is_claimed=False)  


class FoundItemCreateAPIView(generics.CreateAPIView):
    """
    API to report a found item. Requires authentication.
    """
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user, is_claimed=False)


class ItemListAPIView(generics.ListAPIView):
    """
    API to retrieve all items. Requires authentication.
    """
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class NonApprovedItemListAPIView(generics.ListAPIView):
    """
    API to retrieve items that are not yet approved (is_claimed=False). Requires authentication.
    """
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Item.objects.filter(is_claimed=False)
    serializer_class = ItemSerializer


class ItemDetailAPIView(generics.RetrieveAPIView):
    """
    API to fetch details of a specific item. Requires authentication.
    """
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    lookup_field = 'id'


class GenerateItemQRAPIView(APIView):
    """
    API to generate a QR code for an item using django-qr-code.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, item_id):
        item = get_object_or_404(Item, id=item_id)

        if item.is_claimed:
            return HttpResponse("This item has already been claimed.", status=400)

        claim_url = request.build_absolute_uri(reverse('claim-item', args=[item.id]))
        qr_options = QRCodeOptions(size='M', border=4)
        qr_svg = make_qr(claim_url, qr_options)

        return HttpResponse(qr_svg, content_type="image/svg+xml")


class ClaimItemAPIView(APIView):
    """
    API to claim an item using the QR code.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, item_id):
        item = get_object_or_404(Item, id=item_id)

        if item.is_claimed:
            return HttpResponse("This item has already been claimed.", status=400)

        item.is_claimed = True
        item.save()

        return HttpResponse(f"Item {item_id} has been successfully claimed!")
