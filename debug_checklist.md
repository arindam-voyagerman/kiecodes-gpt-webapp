# RAG Chatbot Debugging Checklist

## 🔍 **Root Cause Analysis**

### **Most Likely Causes:**

1. **System Prompt Injection Issues**
   - Web app adds system prompt as hidden message vs. assistant instructions
   - System prompt gets processed differently in conversation context
   - Multiple system prompts causing confusion

2. **Context Window Management**
   - Web app maintains conversation history differently
   - System prompt + conversation history exceeds context limits
   - Message ordering affects retrieval context

3. **Assistant Configuration Mismatch**
   - Different assistant versions between playground and web app
   - File attachments not properly linked
   - Retrieval tool configuration differences

4. **API Request Differences**
   - Different parameters passed to runs.create()
   - Missing or incorrect metadata
   - Thread management issues

## 🛠️ **Step-by-Step Debugging Process**

### **Phase 1: Verify Assistant Configuration**

1. **Check Assistant Settings:**
   ```bash
   python debug_assistant.py
   ```
   - Verify assistant ID matches
   - Confirm retrieval tool is enabled
   - Check file attachments are present

2. **Compare System Instructions:**
   - Export assistant instructions from OpenAI dashboard
   - Compare with system_prompt in main.py
   - Look for character differences, encoding issues

### **Phase 2: API Request Comparison**

1. **Enable Detailed Logging:**
   - Check FastAPI logs for request/response details
   - Monitor OpenAI API calls with logging

2. **Compare Request Parameters:**
   - Direct API: Uses assistant instructions
   - Web App: Injects system prompt as message
   - Check if additional_instructions parameter is used

### **Phase 3: Message Flow Analysis**

1. **Trace Message Sequence:**
   - System prompt injection timing
   - User message processing order
   - Assistant response generation

2. **Check Context Window:**
   - Calculate total tokens (system + history + user message)
   - Verify if context truncation occurs

### **Phase 4: Response Analysis**

1. **Compare Outputs:**
   - Same question via playground vs web app
   - Check if retrieval results differ
   - Analyze response patterns

## 🔧 **Specific Solutions**

### **Solution 1: Fix System Prompt Injection**

**Problem:** System prompt as hidden message vs assistant instructions

**Fix:** Use additional_instructions parameter instead of hidden message

### **Solution 2: Optimize Context Management**

**Problem:** Context window overflow or poor message ordering

**Fix:** Implement smart context truncation and message prioritization

### **Solution 3: Standardize Assistant Configuration**

**Problem:** Configuration drift between environments

**Fix:** Programmatically sync assistant settings

### **Solution 4: Add Request Validation**

**Problem:** Inconsistent API parameters

**Fix:** Add request logging and parameter validation

## 📊 **Testing Protocol**

1. **Baseline Test:**
   - Same question in playground
   - Same question via web app
   - Document differences

2. **Isolation Test:**
   - Test with minimal system prompt
   - Test with no conversation history
   - Test with identical parameters

3. **Progressive Test:**
   - Add complexity incrementally
   - Identify breaking point
   - Isolate problematic component

## 🚨 **Common Issues & Quick Fixes**

| Issue | Symptom | Quick Fix |
|-------|---------|-----------|
| System prompt ignored | Generic responses | Move to assistant instructions |
| Context overflow | Truncated responses | Implement message pruning |
| File not found | No retrieval results | Verify file IDs in assistant |
| Wrong assistant | Different behavior | Double-check assistant_id |
| Rate limiting | Intermittent failures | Add retry logic |

## 📝 **Debug Commands**

```bash
# Test direct API call
python debug_assistant.py

# Check FastAPI logs
tail -f logs/fastapi.log

# Monitor OpenAI requests
export OPENAI_LOG=debug
python main.py

# Compare responses
curl -X POST "http://localhost:8000/api/threads/{thread_id}" \
  -H "Content-Type: application/json" \
  -d '{"content": "What are the school hours?"}'
```