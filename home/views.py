from django.shortcuts import render_to_response
from django.template import RequestContext
from map_layer.models import Layer
from map_points.models import FilePoints
# Create your views here.

def index(request):
    return render_to_response('home/index.html',{'layers':Layer.objects.all(),'points':FilePoints.objects.all() },RequestContext(request))