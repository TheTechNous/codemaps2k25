from haystack import indexes
from .models import YourModel

class YourModelIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    field1 = indexes.CharField(model_attr='field1')
    field2 = indexes.CharField(model_attr='field2')

    def get_model(self):
        return YourModel

    def index_queryset(self, using=None):
        return self.get_model().objects.all()
