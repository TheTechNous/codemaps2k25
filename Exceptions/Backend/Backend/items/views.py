from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from .models import Item
from .serializers import ItemSerializer
from users.models import User 

class LostItemCreateAPIView(APIView):
    """
    API to submit a lost item.
    """
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Returns the serializer fields so DRF can display a form."""
        serializer = ItemSerializer()
        return Response(serializer.data)
    
    def post(self, request):
        data = request.data.copy()
        data['is_claimed'] = False 
        
        serializer = ItemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Lost item submitted successfully!", "item": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FoundItemCreateAPIView(APIView):
    """
    API to submit a found item.
    """
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Returns the serializer fields so DRF can display a form."""
        serializer = ItemSerializer()
        return Response(serializer.data)
    
    def post(self, request):
        data = request.data.copy()
        data['is_claimed'] = True  # Mark the item as found

        serializer = ItemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Found item submitted successfully!", "item": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ItemListAPIView(generics.ListAPIView):
    """
    API to fetch all items.
    """
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class NonApprovedItemListAPIView(generics.ListAPIView):
    """
    API to fetch only non-approved (unclaimed) items.
    """
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Item.objects.filter(is_claimed=False)  # Fetch only unclaimed items
    serializer_class = ItemSerializer

class ItemDetailAPIView(generics.RetrieveAPIView):
    """
    API to fetch details of a specific item using its ID.
    """
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def get(self, request, item_id):
        try:
            item = Item.objects.get(id=item_id)
            serializer = ItemSerializer(item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Item.DoesNotExist:
            return Response({"message": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
        
