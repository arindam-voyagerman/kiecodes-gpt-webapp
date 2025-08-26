"""
RAG Chatbot Debugging Script
This script helps identify discrepancies between direct API calls and web app integration
"""

import asyncio
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
assistant_id = os.getenv("OPENAI_ASSISTANT_ID")

async def debug_direct_api_call(test_message="What are the school hours?"):
    """Test direct API call to compare with web app behavior"""
    print("=== DIRECT API CALL DEBUG ===")
    
    # Create thread
    thread = await client.beta.threads.create()
    print(f"Thread ID: {thread.id}")
    
    # Add message
    message = await client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=test_message
    )
    print(f"Message ID: {message.id}")
    print(f"Message Content: {test_message}")
    
    # Create run
    run = await client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id
    )
    print(f"Run ID: {run.id}")
    print(f"Initial Run Status: {run.status}")
    
    # Poll for completion
    while run.status in ["queued", "in_progress"]:
        await asyncio.sleep(1)
        run = await client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )
        print(f"Run Status: {run.status}")
    
    print(f"Final Run Status: {run.status}")
    
    if run.status == "completed":
        # Get messages
        messages = await client.beta.threads.messages.list(thread_id=thread.id)
        for msg in messages.data:
            if msg.role == "assistant":
                print(f"Assistant Response: {msg.content[0].text.value}")
                break
    else:
        print(f"Run failed with status: {run.status}")
        if run.last_error:
            print(f"Error: {run.last_error}")
    
    return thread.id, run.id

async def debug_assistant_configuration():
    """Check assistant configuration"""
    print("\n=== ASSISTANT CONFIGURATION DEBUG ===")
    
    try:
        assistant = await client.beta.assistants.retrieve(assistant_id)
        print(f"Assistant Name: {assistant.name}")
        print(f"Assistant Model: {assistant.model}")
        print(f"Assistant Instructions Length: {len(assistant.instructions or '')}")
        print(f"Tools: {[tool.type for tool in assistant.tools]}")
        print(f"File IDs: {assistant.file_ids}")
        
        # Check if retrieval tool is enabled
        has_retrieval = any(tool.type == "retrieval" for tool in assistant.tools)
        print(f"Has Retrieval Tool: {has_retrieval}")
        
        return assistant
    except Exception as e:
        print(f"Error retrieving assistant: {e}")
        return None

async def compare_system_prompts(web_app_prompt, direct_prompt=None):
    """Compare system prompts between web app and direct calls"""
    print("\n=== SYSTEM PROMPT COMPARISON ===")
    
    if direct_prompt is None:
        # Get assistant instructions
        assistant = await client.beta.assistants.retrieve(assistant_id)
        direct_prompt = assistant.instructions or ""
    
    print(f"Web App Prompt Length: {len(web_app_prompt)}")
    print(f"Direct API Prompt Length: {len(direct_prompt)}")
    
    if web_app_prompt != direct_prompt:
        print("⚠️  SYSTEM PROMPTS ARE DIFFERENT!")
        print("This could be the root cause of different responses.")
        
        # Show first 200 chars of each
        print(f"Web App Start: {web_app_prompt[:200]}...")
        print(f"Direct API Start: {direct_prompt[:200]}...")
    else:
        print("✅ System prompts match")

if __name__ == "__main__":
    # Example usage
    asyncio.run(debug_direct_api_call())
    asyncio.run(debug_assistant_configuration())