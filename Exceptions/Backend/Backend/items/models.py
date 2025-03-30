from django.db import models
from users.models import User


class Item(models.Model):
    item_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=False)
    found_location = models.CharField(max_length=255, blank=True, null=False)
    found_date = models.DateField()
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="items_posted")
    is_claimed = models.BooleanField(default=False)
    claimed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="items_claimed")
    claimed_date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.item_name
    

class ItemImage(models.Model):
    """
    Model to store multiple images for each item.
    """
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="item_images/")  # Store images in the media directory
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.item.item_name}"
