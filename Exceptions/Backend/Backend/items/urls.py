from django.urls import path
from .views import LostItemCreateAPIView, FoundItemCreateAPIView, ItemListAPIView, NonApprovedItemListAPIView, ItemDetailAPIView

urlpatterns = [
    path('lost-form/', LostItemCreateAPIView.as_view(), name='lost-item-create'),
    path('found-form/', FoundItemCreateAPIView.as_view(), name='found-item-create'),
    path('all/', ItemListAPIView.as_view(), name='item-list'),
    path('pending/', NonApprovedItemListAPIView.as_view(), name='non-approved-items'),
    path('items/<int:item_id>/', ItemDetailAPIView.as_view(), name='item-detail'),
]
