from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
from bs4 import BeautifulSoup
from .serializers import ScrapedDataSerializer
from urllib.parse import urljoin

@api_view(['POST'])
def scrape_website(request):
    url = request.data.get('url')
    if not url:
        return Response({'error': 'URL is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Add headers to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Process images with full URLs
        images = []
        for img in soup.find_all('img'):
            src = img.get('src')
            if src:
                # Convert relative URLs to absolute URLs
                full_url = urljoin(url, src)
                images.append(full_url)
        
        # Get meta description or fallback to a snippet of text
        description = ''
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc and meta_desc.get('content'):
            description = meta_desc['content']
        else:
            # Fallback to first paragraph or some text content
            first_p = soup.find('p')
            if first_p:
                description = first_p.get_text()[:500]  # Limit to 500 chars
        
        data = {
            'url': url,
            'title': soup.title.string if soup.title else 'No title found',
            'description': description,
            'images': images
        }
        
        serializer = ScrapedDataSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except requests.RequestException as e:
        return Response(
            {'error': f'Error fetching URL: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': f'An unexpected error occurred: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )