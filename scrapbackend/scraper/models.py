from django.db import models

class ScrapedData(models.Model):
    url = models.URLField()
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    images = models.JSONField(default=list)
    timestamp = models.DateTimeField(auto_now_add=True)