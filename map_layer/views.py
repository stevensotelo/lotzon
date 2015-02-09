from django.shortcuts import render,get_object_or_404,render_to_response
from django.http import HttpResponseRedirect,HttpResponse,StreamingHttpResponse
from django.template import RequestContext
from django.conf import settings
from django.views.decorators.csrf import csrf_protect

from map_layer.models import Layer
from map_layer.forms import LayerForm

import zipfile
import os

def index(request):
    return render(request, 'map_layer/index.html',{'layers':Layer.objects.all()})

def get(request, id):
    response = HttpResponse(open(os.path.join(settings.MAPS_LAYER, str(id) + '.zip'), 'rb'), content_type='application/zip')
    response["Access-Control-Allow-Origin"] = "*"
    return response

@csrf_protect
def add(request):
    layer = LayerForm()
    if request.method == 'POST':
        layer = LayerForm(request.POST)
        if layer.is_valid():
            model = layer.save()
            process_file(request.FILES['file'], model)            
            return HttpResponseRedirect('/map/layer')        
    return render_to_response('map_layer/add.html',{'layer':layer },RequestContext(request))

def process_file(file, layer):
    file_name = os.path.join(settings.MAPS_LAYER, str(layer.id) + '.json')
    file_map = open(file_name, 'w+')
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
    content_map = ""
    count_sections = 0
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
            if line == 7:    
                content_map += '{"content":['
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
                        count_sections += 1
                    else:
                        lon_dictionary[current]='["' + str(lon_start) + '","' + str(lon_end) + '"],'
                        count_sections += 1
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
                content_map += line_lat + line_lon[0:len(line_lon)-1] + ']}' + ("" if (number_row)==rows else ",")  + return_line
        line += 1
        if line > 7:
            print ("Line: " + str(number_row) + " from: " + str(rows) + " " + str((number_row/rows)*100) + "%")        
    file_map.write(content_map[:len(content_map)-2] + '],\n"header":{"size":"' + str(cell)  + '","rows":"' + str(rows) + '","sections":"' + str(count_sections) + '"}}')
    file_map.close()
    #compress file
    zf = zipfile.ZipFile(os.path.join(settings.MAPS_LAYER, str(layer.id) + '.zip'), 'w', zipfile.ZIP_DEFLATED)
    zf.write(file_name,str(layer.id) + ".json")
    zf.close()
    

def longitude(cellsize,col,xcorner):
    return (col*cellsize)+xcorner

def latitude(cellsize,row,ycorner,nrows):
    return ((nrows-row)*cellsize)+ycorner