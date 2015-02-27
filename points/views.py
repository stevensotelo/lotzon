from django.shortcuts import render
from django.http import HttpResponse

from django.views.generic.base import View
from django.core import serializers

from points.models import Points

import json

class PointsView(View):
    
    def get(self, request, *args, **kwargs):
        try:            
            #http://localhost:8000/api/points/get/json/
            format = self.kwargs['format']
            q = request.GET.get("q")
            data =[]
            if q is not None:
                data = Points.objects.filter(name__contains = q)
            else:
                data = Points.objects.all()          
            return HttpResponse(serializers.serialize(format, data), content_type='application/' + format)
        except Exception as e:
            return HttpResponse( json.dumps({"error" : str(e) }), content_type='application/' + format )
    
    def post(self, request, *args, **kwargs):
        try:            
            #http://localhost:8000/api/points/post/json/
            format = self.kwargs['format']
            json_raw = request.body.decode(encoding='UTF-8')
            obj = json.loads(json_raw)            
            entity = Points( name = obj["name"])
            entity.save()
            return HttpResponse(json.dumps({"message" : "OK"}), content_type='application/' + format)           
        except Exception as e:
            return HttpResponse( json.dumps({"error" : str(e) }), content_type='application/' + format )
        
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
        