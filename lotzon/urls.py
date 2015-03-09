from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    url(r'^$', 'lotzon.views.index',name='index'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/points/', include('points.urls',namespace="points")),
    url(r'^api/layers/', include('layers.urls',namespace="layers")),
)