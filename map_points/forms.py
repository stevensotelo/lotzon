from django.forms import forms, ModelForm

from map_points.models import FilePoints

class FilePointsForm(ModelForm):
    class Meta:
        model=FilePoints
        fields = ['name']