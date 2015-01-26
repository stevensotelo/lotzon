# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Header',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('cols', models.IntegerField()),
                ('rows', models.IntegerField()),
                ('type_raster', models.CharField(max_length=2)),
                ('xcorner', models.FloatField()),
                ('ycorner', models.FloatField()),
                ('cellsize', models.FloatField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Map',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('title', models.CharField(max_length=90)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Row',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('number', models.IntegerField()),
                ('latitude', models.FloatField()),
                ('map', models.ForeignKey(to='maps_data.Map')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('value', models.FloatField()),
                ('start', models.FloatField()),
                ('end', models.FloatField()),
                ('row', models.ForeignKey(to='maps_data.Row')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='header',
            name='map',
            field=models.ForeignKey(to='maps_data.Map'),
            preserve_default=True,
        ),
    ]
