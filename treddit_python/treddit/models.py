from django.db import models
from djangotoolbox.fields import ListField


class Trade(models.Model):
    
    type = models.IntegerField()
    title = models.CharField(max_length=80)
    description = models.TextField()
    trans_items = ListField()
    recv_items = ListField()
    
class Item(models.Model):
    
    id = models.IntegerField(primary_key=True)
    original_id = models.IntegerField()
    defindex = models.IntegerField()

