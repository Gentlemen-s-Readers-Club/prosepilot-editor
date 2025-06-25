#!/usr/bin/env python3
"""
Test script for the prosepilot-agent book generation API with credit system.
Run this while the prosepilot-agent is running.
"""

import requests
import json

# Configure the agent URL (adjust if running on a different port)
AGENT_URL = "http://localhost:8000/"  # Update if your agent runs on a different port
TEST_USER_TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjlzUXlpQ2RLbUpXSmpjTXIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3Z3Ymh6dHRwcGFmeWFiZnFweWJjLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI0MTM0NjhlYS0wMzA2LTRmYWYtODk4YS02Y2Y4OWVmZjMyZmMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzUwODEzNTc1LCJpYXQiOjE3NTA4MDk5NzUsImVtYWlsIjoicGF1bG8uZ3VlcnJhLmZpZ3VlaXJlZG9AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6InBhdWxvLmd1ZXJyYS5maWd1ZWlyZWRvQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJQYXVsbyBHdWVycmEiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjQxMzQ2OGVhLTAzMDYtNGZhZi04OThhLTZjZjg5ZWZmMzJmYyJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzUwNzk0MDU3fV0sInNlc3Npb25faWQiOiIxNDFmMmRjZC0yMDgyLTRjOGQtOTZlOS0yZDVmNjA5ZTQwZWIiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.zmyg0O6WC7z27N6Vf0W6BnrrScpRGWqqJuKwAPUNJtA"

def test_book_generation():
    """Test the book generation endpoint."""
    print("📚 Testing book generation with credit system...")
    
    url = f"{AGENT_URL}api/v1/generate-book"
    headers = {
        "Authorization": f"Bearer {TEST_USER_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Test book generation request
    payload = {
        "prompt": "Write a story about a friendly dragon who learns to bake cookies",
        "author_name": "Test Author",
        "language": {
            "id": "001a11b1-a5cc-470c-a648-a81966bd6a65",
            "name": "Italian",
            "code": "it"
        },
        "categories": [
            {
                "id": "cb78673f-97ab-45d9-85c9-bc0f37f633f1", 
                "name": "Children's Books"
            }
        ],
        "narrator": {
            "id": "714367c7-cde9-407c-a1fb-3cfe85f465cc",
            "name": "714367c7-cde9-407c-a1fb-3cfe85f465cc"
        },
        "tone": {
            "id": "0b36e9ef-c77e-4b80-90ed-19b554f16527",
            "name": "Sarcastic"
        },
        "literature_style": {
            "id": "0842ee1d-ce2e-492d-ba77-ebe1834147cf",
            "name": "Surrealism"
        }
    }
    
    print("Sending book generation request...")
    response = requests.post(url, headers=headers, json=payload)
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.text}")
    
    if response.status_code == 200:
        result = response.json()
        if result.get("success"):
            print("✅ Book generation request successful!")
            if result.get("is_valid"):
                print("✅ Book validation passed!")
                print("🔄 Book generation is running in the background...")
                if "book" in result:
                    book_id = result["book"].get("id")
                    print(f"📖 Book ID: {book_id}")
            else:
                print("❌ Book validation failed!")
                print(f"Issues: {result.get('issues')}")
        else:
            print(f"❌ Book generation failed: {result.get('message')}")
    else:
        print("❌ Request failed!")

if __name__ == "__main__":
    print("🚀 Testing prosepilot-agent Credit System")
    print("=" * 50)
    
    if TEST_USER_TOKEN == "YOUR_AUTH_TOKEN":
        print("❌ Please update the TEST_USER_TOKEN in this script!")
        print("You need a valid JWT token from your authentication system")
        exit(1)
    
    try:
        test_book_generation()
        print("\n🎉 Testing completed!")
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
