from django.db import models

class Map(models.Model):
    title = models.CharField(max_length=90)    
    
    #def __unicode__(self):
    #    return "Map: " + self.title + self.header

class Header(models.Model):
    cols = models.IntegerField()
    rows = models.IntegerField()
    type_raster = models.CharField(max_length=2)
    xcorner = models.FloatField()
    ycorner = models.FloatField()
    cellsize = models.FloatField()    
    map = models.ForeignKey('Map')
    
    #def __unicode__(self):
    #    return "Header: Cols=" + self.cols + " Rows=" + self.rows + " Type=" + self.type_raster

class Row(models.Model):    
    number = models.IntegerField()    
    map = models.ForeignKey('Map')

class Section(models.Model):
    value = models.FloatField()
    start = models.FloatField()
    end = models.FloatField()    
    row = models.ForeignKey('Row')
    
    #def __unicode__(self):
    #    return "Section: Value=" + self.value + " Start=" + self.start + " End=" + self.end