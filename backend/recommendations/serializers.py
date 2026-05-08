from rest_framework import serializers
from .models import UserPreference
from products.serializers import PlanteSerializer

class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = ['light_level', 'watering_frequency', 'has_pets', 'has_children', 'experience_level', 'primary_goal']

    def create(self, validated_data):
        user = self.context['request'].user
        preference, created = UserPreference.objects.update_or_create(
            user=user,
            defaults=validated_data
        )
        return preference
