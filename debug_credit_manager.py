#!/usr/bin/env python3
"""
Debug script to test CreditManager directly.
"""

import sys
import os

# Add the prosepilot-agent to the Python path
sys.path.append('/Users/paulo.guerra/Documents/pauloguerraf-PROJECTS/AI_BOLT_HACKATHON/prosepilot-agent')

# Set environment variables
os.environ['SUPABASE_URL'] = 'https://vwbhzttppafyabfqpybc.supabase.co'
os.environ['SUPABASE_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Ymh6dHRwcGFmeWFiZnFweWJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODczODQ0OCwiZXhwIjoyMDY0MzE0NDQ4fQ.yuh9dX4uq8yANblMuw6CddEnfzwQ75tN8XXTCneGJps'
os.environ['PADDLE_ENV'] = 'sandbox'

try:
    from app.models.subscriptions.credit_manager import CreditManager
    
    # Test user ID from the token
    user_id = "413468ea-0306-4faf-898a-6cf89eff32fc"
    
    print("🚀 Testing CreditManager directly")
    print("=" * 50)
    
    # Initialize CreditManager
    print("📝 Initializing CreditManager...")
    credit_manager = CreditManager()
    print(f"✅ CreditManager initialized with environment: {credit_manager.environment}")
    
    # Test balance check
    print(f"\n💰 Checking balance for user: {user_id}")
    balance_result = credit_manager.check_balance(user_id)
    print(f"📊 Balance result: {balance_result}")
    
    if balance_result.get("success"):
        print(f"✅ Balance check successful: {balance_result.get('balance')} credits")
        
        # Test credit reservation
        print(f"\n🔒 Testing credit reservation...")
        import uuid
        book_generation_id = str(uuid.uuid4())
        
        reserve_result = credit_manager.reserve_credits(
            user_id=user_id,
            amount=5,
            book_generation_id=book_generation_id,
            book_title="Test Book via CreditManager"
        )
        print(f"📊 Reserve result: {reserve_result}")
        
        if reserve_result.get("success"):
            print("✅ Credit reservation successful!")
        else:
            print(f"❌ Credit reservation failed: {reserve_result.get('error')}")
    else:
        print(f"❌ Balance check failed: {balance_result.get('error')}")
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
