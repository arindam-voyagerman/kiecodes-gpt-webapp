"""
Assistant Configuration Synchronization Script
Ensures your OpenAI Assistant has the correct configuration for RAG functionality
"""

import asyncio
import os
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
assistant_id = os.getenv("OPENAI_ASSISTANT_ID")

# Your school-specific instructions
SCHOOL_INSTRUCTIONS = """
You are an intelligent, helpful school assistant for The Newtown School. You are designed to provide accurate, relevant, most recent, latest and updated answers strictly based on information retrieved from the school's knowledge base via a vector database (RAG system).

🚀 MANDATORY FIRST MESSAGE BEHAVIOR:
At the beginning of every new chat session, regardless of user input, automatically say:
"Hi, I am NTS Assistant for admission enquiry. May I know your name please?"

[Rest of your system prompt...]
"""

async def sync_assistant_configuration():
    """Synchronize assistant configuration with your requirements"""
    print("🔄 Syncing Assistant Configuration...")
    
    try:
        # Get current assistant
        assistant = await client.beta.assistants.retrieve(assistant_id)
        print(f"📋 Current Assistant: {assistant.name}")
        print(f"📋 Current Model: {assistant.model}")
        print(f"📋 Current Tools: {[tool.type for tool in assistant.tools]}")
        
        # Check if retrieval tool is present
        has_retrieval = any(tool.type == "retrieval" for tool in assistant.tools)
        
        if not has_retrieval:
            print("⚠️  WARNING: Retrieval tool not found!")
            print("Adding retrieval tool...")
            
            # Update assistant with retrieval tool
            updated_assistant = await client.beta.assistants.update(
                assistant_id=assistant_id,
                tools=[
                    {"type": "retrieval"},
                    {"type": "code_interpreter"}  # Optional: add if needed
                ]
            )
            print("✅ Added retrieval tool")
        
        # Update instructions
        if assistant.instructions != SCHOOL_INSTRUCTIONS:
            print("📝 Updating assistant instructions...")
            await client.beta.assistants.update(
                assistant_id=assistant_id,
                instructions=SCHOOL_INSTRUCTIONS
            )
            print("✅ Instructions updated")
        else:
            print("✅ Instructions already up to date")
        
        # List files attached to assistant
        print(f"📁 Files attached: {len(assistant.file_ids)}")
        for file_id in assistant.file_ids:
            try:
                file_info = await client.files.retrieve(file_id)
                print(f"   - {file_info.filename} ({file_info.bytes} bytes)")
            except Exception as e:
                print(f"   - {file_id} (Error: {e})")
        
        print("🎉 Assistant configuration sync complete!")
        
    except Exception as e:
        print(f"❌ Error syncing assistant: {e}")

async def test_assistant_retrieval():
    """Test if assistant can retrieve information correctly"""
    print("\n🧪 Testing Assistant Retrieval...")
    
    # Create a test thread
    thread = await client.beta.threads.create()
    
    # Add a test message
    await client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content="What are the school hours for Newtown School?"
    )
    
    # Create run
    run = await client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id
    )
    
    # Wait for completion
    while run.status in ["queued", "in_progress"]:
        await asyncio.sleep(1)
        run = await client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )
    
    if run.status == "completed":
        # Get response
        messages = await client.beta.threads.messages.list(thread_id=thread.id)
        assistant_message = next(msg for msg in messages.data if msg.role == "assistant")
        
        response = assistant_message.content[0].text.value
        print(f"✅ Test Response: {response[:200]}...")
        
        # Check if response seems to use retrieval
        if len(response) > 50 and "I don't have" not in response:
            print("✅ Retrieval appears to be working")
        else:
            print("⚠️  Response seems generic - check your knowledge base")
    else:
        print(f"❌ Test failed with status: {run.status}")
        if run.last_error:
            print(f"Error: {run.last_error}")

if __name__ == "__main__":
    asyncio.run(sync_assistant_configuration())
    asyncio.run(test_assistant_retrieval())