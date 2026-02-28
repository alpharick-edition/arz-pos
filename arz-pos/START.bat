@echo off
echo ========================================
echo   ARZ POS - Starting...
echo ========================================
echo.

:: Check if node_modules exists, if not install
if not exist "node_modules\" (
    echo Installing dependencies for first time... please wait.
    echo This only happens once!
    echo.
    call npm install
    echo.
)

echo Opening ARZ POS in your browser...
echo Press CTRL+C to stop the server.
echo.
call npm run start
