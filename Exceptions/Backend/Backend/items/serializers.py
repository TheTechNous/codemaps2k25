from rest_framework import serializers
from items.models import Item, ItemImage

class ItemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemImage
        fields = ['id', 'image', 'uploaded_at']

class ItemSerializer(serializers.ModelSerializer):
    images = ItemImageSerializer(many=True, read_only=True)  # Include images in response
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, use_url=False), write_only=True
    )

    class Meta:
        model = Item
        fields = ['item_name', 'description', 'found_location', 'found_date', 'is_claimed', 'images', 'uploaded_images']

    def create(self, validated_data):
        request = self.context.get('request') 
        if not request or not request.user:
            raise serializers.ValidationError({"posted_by": "User authentication required."})

        validated_data['posted_by'] = request.user 
        uploaded_images = validated_data.pop('uploaded_images', [])
        item = Item.objects.create(**validated_data)

        for image in uploaded_images:
            ItemImage.objects.create(item=item, image=image)

        return item

