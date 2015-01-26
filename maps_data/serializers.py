from django.forms import widgets
from rest_framework import serializers

from maps_data.models import Map, Header, Row, Section

class MapSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=90) 
    cols = serializers.IntegerField()
    rows = serializers.IntegerField()
    type_raster = serializers.CharField(max_length=2)
    xcorner = serializers.FloatField()
    ycorner = serializers.FloatField()
    cellsize = serializers.FloatField() 