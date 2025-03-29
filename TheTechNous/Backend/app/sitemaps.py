from django.contrib.sitemaps import Sitemap
from app.models import BlogPost


class BlogPostSitemap(Sitemap):
    """
    Sitemap for BlogPost model.
    """
    changefreq = "daily"
    priority = 0.8

    def items(self):
        """
        Returns all BlogPost objects.
        """
        return BlogPost.objects.all()

    def lastmod(self, obj):
        """
        Returns the last modified date of the BlogPost object.
        """
        return obj.updated_at

    def location(self, obj):
        """
        Returns the absolute URL of the BlogPost object.
        """
        return obj.get_absolute_url()
