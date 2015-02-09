from django.forms import forms, ModelForm

from map_layer.models import Layer

class LayerForm(ModelForm):
    class Meta:
        model=Layer
        fields = ['title']