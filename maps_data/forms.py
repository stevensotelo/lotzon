from django import forms
from maps_data.models import Map

class MapForm(forms.Form):    
    class Meta:
        model = Map
        file = forms.FileField()
        error_messages = {
            'title': {
                'max_length': ("Field is biggest"),
                'null': ("Field is mandatory"),
            },
        }