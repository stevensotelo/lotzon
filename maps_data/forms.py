from django import forms
from maps_data.models import Map

class MapForm(forms.Form):    
    class Meta:
        model = Map
        #file = forms.FileField()
        #fields = ['name', 'title', 'birth_date']
        