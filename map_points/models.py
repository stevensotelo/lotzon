from django.db import models

class FilePoints(models.Model):
    name = models.CharField(max_length=90)
    
    def __unicode__(self):
        return self.name