# Cursor Todo List

*Last updated: 2024-12-19*


## Current Session Context

- Session started: 2024-12-19
- Previous session summary: Backend verification completed, starting frontend debugging
- User request: Create instructions for backend validation on session startup

## AI Assistant Startup Rules

**🚨 CRITICAL: YOU MUST FOLLOW THESE RULES IMMEDIATELY ON EVERY SESSION STARTUP - NO EXCEPTIONS! 🚨**

### Rule 1: Automatic Backend & Frontend Validation & Startup
**ON EVERY SESSION STARTUP, I MUST:**

#### Backend Validation & Startup:
1. Immediately run backend validation using one of these methods:
   ```bash
   curl http://localhost:5000/
   ```
   OR
   ```bash
   cd backend
   npm run validate
   ```
2. Report validation results to user
3. **IF BACKEND IS NOT RUNNING, AUTOMATICALLY START IT:**
   ```bash
   cd backend
   npm install
   npm run build
   Start-Process node -ArgumentList "dist/server.js" -WindowStyle Hidden
   ```
4. Wait 3-5 seconds for server to start
5. Re-validate with curl test: `curl http://localhost:5000/`
6. Only proceed after confirming backend is running on port 5000

#### Frontend Validation & Startup:
7. **IMMEDIATELY AFTER BACKEND IS RUNNING, START FRONTEND:**
   ```bash
   Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'G:\My Drive\MyTemp\GenAI\GenAI_Coding_Tests\weather-app-v3\frontend'; yarn dev"
   ```
8. Wait 3-5 seconds for frontend to start
9. Verify frontend is running: `curl http://localhost:5173/`
10. Report both services status to user

**CRITICAL:** Both services must be running before proceeding with any other tasks

**POWERSHELL NOTES:**
- Don't use `&&` syntax (not supported in PowerShell)
- Always run commands from correct directory
- **Backend:** Use `Start-Process node -ArgumentList "dist/server.js" -WindowStyle Hidden` for background server
- **Frontend:** Use `Start-Process powershell` with new window to avoid blocking current terminal
- Both services must be validated with curl tests before proceeding

### Rule 2: Session Context Check
- **FIRST THING ON STARTUP:** Read and analyze `.cursor-todo.md` 
- **IMMEDIATELY AFTER:** Follow Rule 1 (Backend Validation)
- **THEN:** Greet user with current task status
- **FINALLY:** Continue with active tasks or start new ones based on user input

**REMEMBER:** These rules are MANDATORY - do not wait for user to ask!

## Backend & Frontend Validation Instructions

### Quick Validation Commands
When starting a new session, run these commands to validate both services:

#### Backend Validation:
**Option 1: Using the validation script**
```bash
cd backend
npm run validate
```

**Option 2: Manual validation**
```bash
# Check if server is running
curl http://localhost:5000/

# Test weather endpoint
curl http://localhost:5000/api/weather/London
```

**Option 3: Using existing tests**
```bash
cd backend
npm test
```

#### Frontend Validation:
```bash
# Check if frontend is running
curl http://localhost:5173/

# Expected: HTML response with status 200
```

### Expected Results
- ✅ **Backend:** Server responds on port 5000
- ✅ **Backend:** Weather API returns valid data structure
- ✅ **Backend:** All endpoints functional
- ✅ **Frontend:** Server responds on port 5173 with HTML content

### If Services Are Not Running

#### Backend Startup:
```bash
cd backend
npm install
npm run build
Start-Process node -ArgumentList "dist/server.js" -WindowStyle Hidden
```

#### Frontend Startup:
```bash
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'G:\My Drive\MyTemp\GenAI\GenAI_Coding_Tests\weather-app-v3\frontend'; yarn dev"
```

**Note:** 
- Backend uses `Start-Process node` for background operation
- Frontend uses `Start-Process powershell` with new window to avoid blocking current terminal
- Both services must be validated with curl tests before proceeding


## Active Tasks

### Task ID: TASK-20241219-003 - Backend Validation Instructions

- **Status**: Completed Successfully
- **Created**: 2024-12-19
- **Completed**: 2024-12-19
- **Description**: Create clear instructions for validating backend is running on session startup
- **Result**: Created comprehensive backend validation system with multiple options:
  - ✅ Created `validate-backend.js` script for automated validation
  - ✅ Added `npm run validate` command to package.json
  - ✅ Documented manual validation commands (curl)
  - ✅ Added validation instructions to todo file with expected results
  - ✅ Provided startup commands if backend is not running


## Completed Tasks

### Task ID: TASK-20241219-001 - Frontend Debugging

- **Status**: Completed Successfully
- **Completed**: 2024-12-19
- **Description**: Debug the frontend application to identify and fix issues
- **Result**: Frontend application is now fully functional with all issues resolved:
  - ✅ All TypeScript compilation errors fixed
  - ✅ Component structure and imports verified
  - ✅ API integration with backend working correctly
  - ✅ All weather endpoints tested and functioning
  - ✅ Application runs without runtime errors

### Task ID: TASK-20241219-002 - Backend Verification

- **Status**: Done Successfully
- **Completed**: 2024-12-19
- **Description**: Verify that the backend server is working properly and all endpoints are functional
- **Result**: Backend server is fully functional with all API endpoints working correctly:
  - ✅ Server starts successfully on port 5000
  - ✅ TypeScript compilation completed without errors
  - ✅ All weather API endpoints working (weather data, reverse geocoding)
  - ✅ All user API endpoints working (user creation, favorites management)
  - ✅ Database connections and data services functioning properly


## Task History

- 2024-12-19: Backend verification completed successfully
- 2024-12-19: Starting frontend debugging session
- 2024-12-19: User requested backend validation instructions for session startup

