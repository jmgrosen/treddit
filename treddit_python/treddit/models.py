from django.db import models
from djangotoolbox.fields import ListField

# Create your models here.

class User(models.Model):
    
    steamid = models.IntegerField()
    reputation = models.IntegerField()
    trades = ListField()

class Trade(models.Model):
    
    type = models.IntegerField()
    title = models.CharField()
    description = models.TextField()
    trans_items = ListField()
    recv_items = ListField()
    
class Item(models.Model):
    
    id = models.IntegerField()
    original_id = models.IntegerField()
    defindex = models.IntegerField()

