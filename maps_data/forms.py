from django.forms import forms, ModelForm

from maps_data.models import Map

class MapForm(ModelForm):
    class Meta:
        model=Map
        fields = ['title']