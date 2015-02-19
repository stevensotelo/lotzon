from django.shortcuts import render,get_object_or_404,render_to_response
from django.http import HttpResponseRedirect,HttpResponse,StreamingHttpResponse
from django.template import RequestContext
from django.conf import settings
from django.views.decorators.csrf import csrf_protect

from map_points.models import FilePoints
from map_points.forms import FilePointsForm

import zipfile
import os
import re

def index(request):
    return render(request, 'map_points/index.html',{'files':FilePoints.objects.all()})

def get(request, id):
    response = HttpResponse(open(os.path.join(settings.MAPS_POINTS, str(id) + '.zip'), 'rb'), content_type='application/zip')
    response["Access-Control-Allow-Origin"] = "*"
    return response

@csrf_protect
def add(request):
    fpform = FilePointsForm()
    if request.method == 'POST':
        fpform = FilePointsForm(request.POST)
        if fpform.is_valid():
            model = fpform.save()
            process_points(request.FILES['file'],model)
            return HttpResponseRedirect('/map/points')        
    return render_to_response('map_points/add.html',{'file':fpform },RequestContext(request))

def process_points(file, file_points):    
    group = -1
    id = -1
    lt = -1
    ln = -1
    text = -1
    value = -1
    number_line = 0
    file_name = os.path.join(settings.MAPS_POINTS, str(file_points.id) + '.json')
    file_writer = open(file_name, 'w+')
    content = ""
    for l in file:
        line=str(l).replace("b'",'').replace("\\r",'').replace("\\n'",'')
        if line != "":
            vals = re.split("\;",str(line).lower())
            if number_line == 0:
                group = vals.index("group")
                id = vals.index("id")
                lt = vals.index("latitude")
                ln = vals.index("longitude")
                text = vals.index("text")
                value = vals.index("value")
            else:
                content += '{"g":"' + vals[group] + '","i":"' + vals[id] + '","lt":"' + vals[lt] + '","ln":"' + vals[ln] + '","t":"' + vals[text] +'","v":"' + vals[value] + '"},\n'
        number_line += 1
    file_writer.write('{"points":[' + content[:len(content)-2] + '],\n"header":{"count":"' + str(number_line)  + '"}}')
    file_writer.close()
    #compress file
    zf = zipfile.ZipFile(os.path.join(settings.MAPS_POINTS, str(file_points.id) + '.zip'), 'w', zipfile.ZIP_DEFLATED)
    zf.write(file_name,str(file_points.id) + ".json")
    zf.close()
            