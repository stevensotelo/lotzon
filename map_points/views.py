from django.shortcuts import render,get_object_or_404,render_to_response
from django.http import HttpResponseRedirect,HttpResponse,StreamingHttpResponse
from django.template import RequestContext
from django.conf import settings
from django.views.decorators.csrf import csrf_protect

from map_points.models import FilePoints
from map_points.forms import FilePointsForm

import zipfile
import os

def index(request):
    return render(request, 'map_points/index.html',{'files':FilePoints.objects.all()})

def get(request, id):
    response = HttpResponse(open(settings.MAPS_POINTS + str(id) + '.zip', 'rb'), content_type='application/zip')
    response["Access-Control-Allow-Origin"] = "*"
    return response

@csrf_protect
def add(request):
    fpform = FilePointsForm()
    if request.method == 'POST':
        fpform = FilePointsForm(request.POST)
        if fpform.is_valid():
            model = fpform.save()
            return HttpResponseRedirect('/map/points')        
    return render_to_response('map_points/add.html',{'file':fpform },RequestContext(request))


    

def longitude(cellsize,col,xcorner):
    return (col*cellsize)+xcorner

def latitude(cellsize,row,ycorner,nrows):
    return ((nrows-row)*cellsize)+ycorner