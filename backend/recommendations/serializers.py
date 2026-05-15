from rest_framework import serializers
from .models import UserPreference
from products.serializers import PlanteSerializer

class UserPreferenceSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserPreference
        fields = ['id', 'user_username', 'light_level', 'watering_frequency', 'experience_level', 'primary_goal']

    def create(self, validated_data):
        user = self.context['request'].user
        preference, created = UserPreference.objects.update_or_create(
            user=user,
            defaults=validated_data
        )
        return preference
