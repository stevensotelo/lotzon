from django.shortcuts import render,get_object_or_404,render_to_response
from django.http import HttpResponseRedirect
from django.template import RequestContext

from maps_data.models import Map, Header, Row, Section
from maps_data.forms import MapForm

import re


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
    file_map = open("maps/" + map.title + ".json", 'w+')
    line = 1
    cols = 0
    rows = 0
    xcorner = 0
    ycorner = 0
    cell = 0
    nodata = ""
    number_row = 1
    pattern = ""
    line_lat = ""
    line_lon = ""
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
                nodata = str(fileline.split()[1])
        else:
            if line == 7:
                file_map.write('"map":{\n"header":{"size":"' + str(cell) + '"},\n"content":{\n')
                #header = Header(cols = cols, rows = rows, type_raster = 'LL', xcorner = xcorner, ycorner = ycorner, cellsize = cell, map = map)
                #header.save()            
            lat = latitude(cell,number_row,ycorner,rows)
            line_lat = '"lt":{"v":"' + str(lat) + '","ln":['
            #file_map.write('"lt":{"v":"' + str(lat) + '","ln":[')
            #row = Row(number = number_row,latitude=lat, map = map)
            #row.save()
            number_row += 1
            #analyze_section(row, fileline, nodata, cell, xcorner)
            data = fileline.split()
            current = ""
            start = -1
            end = 1
            line_lon = ""
            for i in range(len(data)):  
                d = str(data[i])
                #end to count
                if (current != d) & (start != -1) :
                    lon_start = longitude(cell,start,xcorner)
                    lon_end = longitude(cell,i-1,xcorner)
                    line_lon += '["' + d +'","' + str(lon_start) + '","' + str(lon_end) + '"],'
                    #file_map.write('["' + d +'","' + str(lon_start) + '","' + str(lon_end) + '"],')                      
                    start = -1
                    current = ""
                #start to count
                if (start == -1) & (d != nodata) & (current != d):
                    start = i
                    current = d
                elif d == nodata:
                    start = -1
                    current = ""
            if line_lon != "":
                file_map.write(line_lat + line_lon + ']},\n')
        line += 1
        if line > 7:
            print ("Line: " + str(line) + " from: " + str(rows) + " " + str(((line-7)/rows)*100) + "%")        
    file_map.write('\n}}')
    file_map.close()
    
    
    
    
    
    
    
    
    
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
            