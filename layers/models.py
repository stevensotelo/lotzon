from django.db import models

class Layer(models.Model):
    title = models.CharField(max_length=90)
    
    def __unicode__(self):
        return self.title
    
    def __str__(self):
        return self.title