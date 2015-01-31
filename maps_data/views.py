from django.shortcuts import render,get_object_or_404,render_to_response
from django.http import HttpResponseRedirect,HttpResponse
from django.template import RequestContext

from maps_data.models import Map
from maps_data.forms import MapForm

import json

def index(request):
    return render(request, 'maps_data/index.html',{'all_maps':Map.objects.all()})

def get(request, id):
    response = HttpResponse(open('maps/' + str(id) + '.json', 'r'), content_type='application/json')
    response.__setitem__("Content-type", "application/json")
    response["Access-Control-Allow-Origin"] = "*"
    return response

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
    file_map = open("maps/" + str(map.id) + ".json", 'w+')
    line = 1
    cols = 0
    rows = 0
    xcorner = 0
    ycorner = 0
    cell = 0
    nodata = ""
    number_row = 0
    pattern = ""
    line_lat = ""
    line_lon = ""
    return_line = "\n"
    for fileline in file:
        if line < 7:
            #if line == 1:
            #    cols = int(fileline.split()[1])
            if line == 2:
                rows = int(fileline.split()[1])
            elif line == 3:
                xcorner = float(fileline.split()[1])
            elif line == 4:
                ycorner = float(fileline.split()[1])
            elif line == 5:
                cell = float(fileline.split()[1])
            elif line == 6:
                nodata = str(fileline.split()[1]).replace("b","").replace("'","")
        else:
            data = fileline.split()
            number_row += 1
            print (number_row)
            if line == 7:
                file_map.write('{"header":{"size":"' + str(cell) + '","rows":"' + str(rows) + '"},"content":[')
                cols = len(data)
            lat = latitude(cell,number_row,ycorner,rows)
            line_lat = '{"v":"' + str(lat) + '","d":['                        
            current = ""
            start = -1
            end = 1
            line_lon = ""
            lon_dictionary = dict()
            for i in range(cols):
                d = str(data[i]).replace("b","").replace("'","")
                if (current != d) & (start != -1) :
                    lon_start = longitude(cell,start,xcorner)
                    lon_end = longitude(cell,i-1,xcorner)                    
                    if current in lon_dictionary:
                        lon_dictionary[current]+='["' + str(lon_start) + '","' + str(lon_end) + '"],'
                    else:
                        lon_dictionary[current]='["' + str(lon_start) + '","' + str(lon_end) + '"],'                      
                    start = -1
                    current = ""
                if (start == -1) & (d != nodata) & (current != d):
                    start = i
                    current = d
                elif d == nodata:
                    start = -1
                    current = ""
            if lon_dictionary != dict():
                for key in lon_dictionary.keys():
                    line_lon += '{"v":"' + key +'","c":['  + lon_dictionary[key][:len(lon_dictionary[key])-1] + ']},'
            if line_lon != "":
                file_map.write(line_lat + line_lon[:len(line_lon)-1] + ']}' + ("" if (number_row)==rows else ",")  + return_line)
        line += 1
        if line > 7:
            print ("Line: " + str(number_row) + " from: " + str(rows) + " " + str((number_row/rows)*100) + "%")        
    file_map.write(']}')
    file_map.close()

def longitude(cellsize,col,xcorner):
    return (col*cellsize)+xcorner

def latitude(cellsize,row,ycorner,nrows):
    return ((nrows-row)*cellsize)+ycorner