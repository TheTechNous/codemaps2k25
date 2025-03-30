from django.urls import path
from items.views import (
    LostItemCreateAPIView,
    FoundItemCreateAPIView,
    ItemListAPIView,
    NonApprovedItemListAPIView,
    ItemDetailAPIView,
)
from .views import (
    GenerateItemQRAPIView,
    ClaimItemAPIView
)

urlpatterns = [     
    path('lost-form/', LostItemCreateAPIView.as_view(), name='lost-item-create'),
    path('found-form/', FoundItemCreateAPIView.as_view(), name='found-item-create'),
    path('all/', ItemListAPIView.as_view(), name='item-list'),
    path('pending/', NonApprovedItemListAPIView.as_view(), name='non-approved-items'),
    path('item/<int:item_id>/', ItemDetailAPIView.as_view(), name='item-detail'),
    path('generate-qr/<int:item_id>/', GenerateItemQRAPIView.as_view(), name='generate-item-qr'),
    path('claim-item/<int:item_id>/', ClaimItemAPIView.as_view(), name='claim-item'),
]
