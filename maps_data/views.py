from django.shortcuts import render,get_object_or_404,render_to_response
from django.http import HttpResponseRedirect
from django.template import RequestContext

from maps_data.models import Map
from maps_data.forms import MapForm


def index(request):
    all_maps = Map.objects.all()
    context = {'all_maps':all_maps}
    return render(request, 'maps_data/index.html', context)

def detail(request, id):
    map = get_object_or_404(Map, pk=id)
    return render(request, 'maps_data/detail.html', map)    

def add(request):
    map = MapForm()
    if request.method == 'POST':
        map = MapForm(request.POST, request.FILES)
        if map.is_valid():
            map.save()
            #process_file(request.FILES['file'])
            return HttpResponseRedirect('/maps/data')        
    return render_to_response('maps_data/add.html',{'map':map},RequestContext(request))

def process_file(file):
    with open('some/file/name.txt', 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)