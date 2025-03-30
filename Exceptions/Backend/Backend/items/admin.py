from django.contrib import admin
from .models import Item, ItemImage

class ItemImageInline(admin.TabularInline):
    model = ItemImage
    extra = 1

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('item_name', 'found_location', 'found_date', 'is_claimed', 'posted_by', 'claimed_by')
    list_filter = ('is_claimed', 'found_date', 'posted_by')
    search_fields = ('item_name', 'description', 'found_location')
    date_hierarchy = 'found_date'
    inlines = [ItemImageInline]
    readonly_fields = ('claimed_date',)
    fieldsets = (
        ('Basic Information', {
            'fields': ('item_name', 'description', 'found_location', 'found_date')
        }),
        ('Status', {
            'fields': ('is_claimed', 'claimed_by', 'claimed_date')
        }),
        ('User Information', {
            'fields': ('posted_by',)
        }),
    )