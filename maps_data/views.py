from django.shortcuts import render,get_object_or_404,render_to_response
from django.http import HttpResponseRedirect
from django.template import RequestContext

from maps_data.models import Map, Header, Row, Section
from maps_data.forms import MapForm


def index(request):
    return render_to_response(request, 'maps_data/index.html',{'all_maps':Map.objects.all()})

def detail(request, id):
    return render(request, 'maps_data/detail.html', { 'map' : get_object_or_404(Map, pk=id)})

def add(request):
    map = MapForm()
    if request.method == 'POST':
        map = MapForm(request.POST)
        if map.is_valid():
            model = map.save()
            process_file(request.FILES['file'], model)            
            return HttpResponseRedirect('/maps/data')        
    return render_to_response('maps_data/add.html',{'map':map },RequestContext(request))

def process_file(file, map):
    line = 1
    cols = 0
    rows = 0
    xcorner = 0
    ycorner = 0
    cell = 0
    nodata = 0
    number_row = 1
    for chunk in file.chunks():
        if line < 7:
            if line == 1:
                cols = int(chunk.split()[1])
            elif line == 1:
                rows = int(chunk.split()[1])
            elif line == 1:
                xcorner = float(chunk.split()[1])
            elif line == 1:
                ycorner = float(chunk.split()[1])
            elif line == 1:
                cell = float(chunk.split()[1])
            elif line == 1:
                nodata = float(chunk.split()[1])
            line += 1
        else:
            if line == 7:
                header = Header(cols = cols, rows = rows, type_raster = 'LL', xcorner = xcorner, ycorner = ycorner, cellsize = cell, map = map)
                header.save()
            row = Row(number = number_row, map = map)
            row.save()
            analyze_section(row, chunk, nodata)

def analyze_section(row, line, nodata):
    col = 0
    data = line.split()
    current = ''
    start = -1
    end = 1
    for i in range(len(data)):
        if float(data[i]) != nodata
        if current != data[i] & float(data[i]) != nodata & i != 0 :
            section = Section(value=float(data[i]), start=start, end=i-1, row=row)
            current = data[i]
            start = i