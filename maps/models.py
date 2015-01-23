from django.db import models
from djangotoolbox.fields import DictField

class Map(models.Model):
    title = models.CharField()

class Header(model.Model):
    type = models.CharField()

#class Row(model.Model):    