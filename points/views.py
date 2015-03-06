from django.conf import settings
from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic.base import View

from points.models import Points

import json
import zipfile
import os
import re


class PointsView(View):
    
    def get(self, request, *args, **kwargs):
        try:            
            #http://localhost:8000/api/points/json/
            format = self.kwargs['format']
            q = request.GET.get("q")
            data =[]
            if q is not None:
                response = HttpResponse(open(os.path.join(settings.MAPS_POINTS, str(q) + '.zip'), 'rb'), content_type='application/zip')
                response["Access-Control-Allow-Origin"] = "*"
                return response
            else:
                data = Points.objects.all()          
            return HttpResponse(serializers.serialize(format, data), content_type='application/' + format)
        except Exception as e:
            return HttpResponse( json.dumps({"error" : str(e) }), content_type='application/' + format )    
    
    def post(self, request, *args, **kwargs):
        try:            
            #http://localhost:8000/api/points/json/
            format = self.kwargs['format']
            entity = Points( name = request.POST['name'])
            entity.save()
            model = Points.objects.latest('id')
            process_points(request.FILES['file'],model,request.POST['split'])
            return HttpResponse(json.dumps({"message" : "OK"}), content_type='application/' + format)           
        except Exception as e:
            print("error")
            print(e)
            return HttpResponse(json.dumps({"error" : str(e) }), content_type='application/' + format)
        
    def delete(self, request, *args, **kwargs):
        try:
            format = self.kwargs['format']
            id = request.GET.get("pk")
            if id is not None and id is not "":
                p = Points.objects.get(pk=id)
                p.delete()
                return HttpResponse(json.dumps({"message" : "The points had been removed"}), content_type='application/' + format)
            else:
                return HttpResponse(json.dumps({"message" : "The points entity don't exist"}), content_type='application/' + format)
        except ObjectDoesNotExist:
            return HttpResponse( json.dumps({"error" : str(e) }), content_type='application/' + format )


def process_points(file, file_points, split):    
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
            vals = re.split(split,str(line).lower())
            print(vals)
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
        