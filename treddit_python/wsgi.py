import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__),'treddit_python')))
os.environ['DJANGO_SETTINGS_MODULE'] = 'treddit_python.settings'
import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
