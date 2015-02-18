from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    url(r'^$', include('home.urls',namespace="home")),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^map/layer/', include('map_layer.urls',namespace="map_layer")),
    url(r'^map/points/', include('map_points.urls',namespace="map_points")),
)