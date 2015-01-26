from django.shortcuts import render,get_object_or_404,render_to_response
from django.http import HttpResponseRedirect
from django.template import RequestContext

from maps_data.models import Map, Header, Row, Section
from maps_data.forms import MapForm


def index(request):
    return render(request, 'maps_data/index.html',{'all_maps':Map.objects.all()})

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
    for fileline in file:
        if line < 7:
            if line == 1:
                cols = int(fileline.split()[1])
            elif line == 2:
                rows = int(fileline.split()[1])
            elif line == 3:
                xcorner = float(fileline.split()[1])
            elif line == 4:
                ycorner = float(fileline.split()[1])
            elif line == 5:
                cell = float(fileline.split()[1])
            elif line == 6:
                nodata = float(fileline.split()[1])
            line += 1
        else:
            if line == 7:
                header = Header(cols = cols, rows = rows, type_raster = 'LL', xcorner = xcorner, ycorner = ycorner, cellsize = cell, map = map)
                header.save()
            lat = latitude(cell,number_row,ycorner,rows)
            row = Row(number = number_row,latitude=lat, map = map)
            row.save()
            number_row += 1
            analyze_section(row, fileline, nodata, cell, xcorner)

def analyze_section(row, line, nodata, cellsize, xcorner):
    col = 0
    data = line.split()
    current = ""
    start = -1
    end = 1
    for i in range(len(data)):        
        #end to count
        if (current != str(data[i])) & (start != -1) :
            lon_start = longitude(cellsize,start,xcorner)
            lon_end = longitude(cellsize,i-1,xcorner)
            section = Section(value=float(data[i]), start=lon_start, end=lon_end, row=row)
            section.save()            
            print (str(i) + " - " + current + " - " + str(data[i]) + " - " + str(start))
            print (str(row.latitude) + ": " + str(lon_start) + " - " + str(lon_end))
            start = -1
            current = ""
        #start to count
        if (start == -1) & (float(data[i]) != nodata) & (current != str(data[i])):
            start = i
            current = str(data[i])
        elif float(data[i]) == nodata:
            start = -1
            current = ""
        

def longitude(cellsize,col,xcorner):
    return (col*cellsize)+xcorner

def latitude(cellsize,row,ycorner,nrows):
    return ((nrows-row)*cellsize)+ycorner
            