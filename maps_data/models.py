from django.db import models

class Map(models.Model):
    title = models.CharField(max_length=90)