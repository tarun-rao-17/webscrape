from django.contrib import admin
from django.urls import path
from scraper import views  # Correct import statement


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/scrape/', views.scrape_website, name='scrape-website'),
]