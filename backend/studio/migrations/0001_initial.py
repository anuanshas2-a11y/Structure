from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Enquiry",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120)),
                ("email", models.EmailField(max_length=254)),
                ("phone", models.CharField(blank=True, max_length=30)),
                ("project_type", models.CharField(max_length=100)),
                ("message", models.TextField(max_length=3000)),
                ("status", models.CharField(choices=[("new", "New"), ("contacted", "Contacted"), ("closed", "Closed")], default="new", max_length=12)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("ai_summary", models.TextField(blank=True)),
                ("ai_priority", models.CharField(blank=True, choices=[("high", "High"), ("medium", "Medium"), ("low", "Low")], max_length=10)),
                ("ai_reply_draft", models.TextField(blank=True)),
            ],
            options={"verbose_name_plural": "enquiries", "ordering": ["-created_at"]},
        ),
    ]
