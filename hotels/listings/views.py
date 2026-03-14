from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Listing
from .serializers import ListingSerializer


def health_check(_request):
    return JsonResponse({"status": "ok", "service": "hotels"})


class ListingView(APIView):
    def get(self, _request):
        queryset = Listing.objects.all()[:20]
        serializer = ListingSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ListingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        listing = serializer.save()
        return Response(ListingSerializer(listing).data, status=201)
