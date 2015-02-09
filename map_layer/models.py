from django.db import models

class Layer(models.Model):
    title = models.CharField(max_length=90)