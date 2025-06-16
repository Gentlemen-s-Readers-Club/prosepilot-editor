"""
Python integration example for the credits system.
This shows how your Python backend can interact with the Supabase credits system.
"""

import requests
import uuid
import logging
from typing import Dict, Any, Optional
from dataclasses import dataclass

@dataclass
class CreditResponse:
    success: bool
    balance: Optional[int] = None
    transaction_id: Optional[str] = None
    error: Optional[str] = None
    details: Optional[str] = None

class CreditsManager:
    def __init__(self, supabase_url: str, supabase_anon_key: str):
        self.supabase_url = supabase_url
        self.credits_endpoint = f"{supabase_url}/functions/v1/handle-credits"
        self.headers = {
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json",
            "apikey": supabase_anon_key
        }
        self.logger = logging.getLogger(__name__)

    def _make_request(self, payload: Dict[str, Any]) -> CreditResponse:
        """Make a request to the credits edge function."""
        try:
            response = requests.post(
                self.credits_endpoint,
                json=payload,
                headers=self.headers,
                timeout=30
            )
            
            data = response.json()
            
            return CreditResponse(
                success=data.get('success', False),
                balance=data.get('balance'),
                transaction_id=data.get('transaction_id'),
                error=data.get('error'),
                details=data.get('details')
            )
        except requests.RequestException as e:
            self.logger.error(f"Request failed: {e}")
            return CreditResponse(success=False, error=str(e))
        except Exception as e:
            self.logger.error(f"Unexpected error: {e}")
            return CreditResponse(success=False, error=str(e))

    def check_balance(self, user_id: str) -> CreditResponse:
        """Check user's current credit balance."""
        payload = {
            "action": "check_balance",
            "user_id": user_id
        }
        return self._make_request(payload)

    def reserve_credits(self, user_id: str, amount: int, book_generation_id: str, 
                       description: str = None, metadata: Dict[str, Any] = None) -> CreditResponse:
        """Reserve credits for book generation (call this when generation starts)."""
        payload = {
            "action": "reserve",
            "user_id": user_id,
            "amount": amount,
            "book_generation_id": book_generation_id,
            "description": description,
            "metadata": metadata or {}
        }
        return self._make_request(payload)

    def consume_credits(self, user_id: str, book_generation_id: str,
                       description: str = None, metadata: Dict[str, Any] = None) -> CreditResponse:
        """Consume reserved credits (call this when generation completes successfully)."""
        payload = {
            "action": "consume",
            "user_id": user_id,
            "book_generation_id": book_generation_id,
            "description": description,
            "metadata": metadata or {}
        }
        return self._make_request(payload)

    def refund_credits(self, user_id: str, book_generation_id: str,
                      description: str = None, metadata: Dict[str, Any] = None) -> CreditResponse:
        """Refund credits (call this when generation fails)."""
        payload = {
            "action": "refund",
            "user_id": user_id,
            "book_generation_id": book_generation_id,
            "description": description,
            "metadata": metadata or {}
        }
        return self._make_request(payload)

    def refill_monthly_credits(self, user_id: str) -> CreditResponse:
        """Refill user's monthly credits based on their subscription."""
        payload = {
            "action": "refill_monthly",
            "user_id": user_id
        }
        return self._make_request(payload)


class BookGenerationService:
    """Example service showing how to integrate credits with book generation."""
    
    def __init__(self, credits_manager: CreditsManager):
        self.credits = credits_manager
        self.logger = logging.getLogger(__name__)

    def start_book_generation(self, user_id: str, book_params: Dict[str, Any]) -> Dict[str, Any]:
        """Start book generation with credit reservation."""
        
        # Generate unique ID for this book generation
        book_generation_id = str(uuid.uuid4())
        
        # Define credit cost (you can make this dynamic based on book complexity)
        credit_cost = self._calculate_credit_cost(book_params)
        
        try:
            # Step 1: Check if user has enough credits
            balance_result = self.credits.check_balance(user_id)
            if not balance_result.success:
                return {
                    "success": False,
                    "error": "Failed to check credit balance",
                    "details": balance_result.error
                }
            
            if balance_result.balance < credit_cost:
                return {
                    "success": False,
                    "error": "Insufficient credits",
                    "required": credit_cost,
                    "available": balance_result.balance
                }
            
            # Step 2: Reserve credits
            reserve_result = self.credits.reserve_credits(
                user_id=user_id,
                amount=credit_cost,
                book_generation_id=book_generation_id,
                description=f"Book generation: {book_params.get('title', 'Untitled')}",
                metadata={
                    "book_params": book_params,
                    "credit_cost": credit_cost
                }
            )
            
            if not reserve_result.success:
                return {
                    "success": False,
                    "error": "Failed to reserve credits",
                    "details": reserve_result.error
                }
            
            # Step 3: Start the actual book generation process
            # This would be your existing book generation logic
            generation_result = self._start_generation_process(book_generation_id, book_params)
            
            return {
                "success": True,
                "book_generation_id": book_generation_id,
                "credits_reserved": credit_cost,
                "remaining_balance": reserve_result.balance,
                "generation_status": generation_result
            }
            
        except Exception as e:
            self.logger.error(f"Error starting book generation: {e}")
            # If something went wrong after reserving credits, try to refund
            try:
                self.credits.refund_credits(
                    user_id=user_id,
                    book_generation_id=book_generation_id,
                    description="Refund due to generation start failure",
                    metadata={"error": str(e)}
                )
            except Exception as refund_error:
                self.logger.error(f"Failed to refund credits: {refund_error}")
            
            return {
                "success": False,
                "error": "Failed to start book generation",
                "details": str(e)
            }

    def complete_book_generation(self, user_id: str, book_generation_id: str, 
                                success: bool, error_message: str = None) -> Dict[str, Any]:
        """Complete book generation and handle credits accordingly."""
        
        try:
            if success:
                # Generation succeeded - consume the reserved credits
                result = self.credits.consume_credits(
                    user_id=user_id,
                    book_generation_id=book_generation_id,
                    description="Book generation completed successfully",
                    metadata={"completion_time": "2024-01-01T00:00:00Z"}  # Add actual timestamp
                )
                
                if result.success:
                    return {
                        "success": True,
                        "message": "Credits consumed successfully",
                        "remaining_balance": result.balance
                    }
                else:
                    return {
                        "success": False,
                        "error": "Failed to consume credits",
                        "details": result.error
                    }
            else:
                # Generation failed - refund the reserved credits
                result = self.credits.refund_credits(
                    user_id=user_id,
                    book_generation_id=book_generation_id,
                    description="Book generation failed - refunding credits",
                    metadata={"error_message": error_message}
                )
                
                if result.success:
                    return {
                        "success": True,
                        "message": "Credits refunded successfully",
                        "remaining_balance": result.balance
                    }
                else:
                    return {
                        "success": False,
                        "error": "Failed to refund credits",
                        "details": result.error
                    }
                    
        except Exception as e:
            self.logger.error(f"Error completing book generation: {e}")
            return {
                "success": False,
                "error": "Failed to complete book generation",
                "details": str(e)
            }

    def _calculate_credit_cost(self, book_params: Dict[str, Any]) -> int:
        """Calculate credit cost based on book parameters."""
        # Base cost
        base_cost = 1
        
        # Add cost based on complexity, length, etc.
        # This is just an example - adjust based on your needs
        if book_params.get('length') == 'long':
            base_cost += 1
        if book_params.get('complexity') == 'high':
            base_cost += 1
        if book_params.get('illustrations'):
            base_cost += 1
            
        return base_cost

    def _start_generation_process(self, book_generation_id: str, book_params: Dict[str, Any]) -> str:
        """Start the actual book generation process."""
        # This would integrate with your existing book generation system
        # For now, just return a status
        return "started"


# Example usage
if __name__ == "__main__":
    # Initialize the credits manager
    credits_manager = CreditsManager(
        supabase_url="https://your-project.supabase.co",
        supabase_anon_key="your-anon-key"
    )
    
    # Initialize the book generation service
    book_service = BookGenerationService(credits_manager)
    
    # Example: Start book generation
    user_id = "user-uuid-here"
    book_params = {
        "title": "My Amazing Book",
        "genre": "fiction",
        "length": "medium",
        "complexity": "normal"
    }
    
    # Start generation
    result = book_service.start_book_generation(user_id, book_params)
    print(f"Generation start result: {result}")
    
    if result["success"]:
        book_generation_id = result["book_generation_id"]
        
        # Simulate book generation process...
        # After 30 minutes, complete the generation
        
        # If successful:
        completion_result = book_service.complete_book_generation(
            user_id=user_id,
            book_generation_id=book_generation_id,
            success=True
        )
        print(f"Completion result: {completion_result}")
        
        # If failed:
        # completion_result = book_service.complete_book_generation(
        #     user_id=user_id,
        #     book_generation_id=book_generation_id,
        #     success=False,
        #     error_message="AI model timeout"
        # ) 