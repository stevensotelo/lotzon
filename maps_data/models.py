from django.db import models
from django.core import serializers

class Map(models.Model):
    title = models.CharField(max_length=90)    

class Header(models.Model):
    cols = models.IntegerField()
    rows = models.IntegerField()
    type_raster = models.CharField(max_length=2)
    xcorner = models.FloatField()
    ycorner = models.FloatField()
    cellsize = models.FloatField()    
    map = models.ForeignKey('Map')

class Row(models.Model):    
    number = models.IntegerField()
    latitude = models.FloatField()
    map = models.ForeignKey('Map')

class Section(models.Model):
    value = models.FloatField()
    start = models.FloatField()
    end = models.FloatField()    
    row = models.ForeignKey('Row')