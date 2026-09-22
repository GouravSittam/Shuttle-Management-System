@echo off
setlocal
echo [Campus Shuttle Transit] Compiling and starting Java Backend...

set JAVAC_BIN=javac
set JAVA_BIN=java

if exist "C:\Program Files\Java\jdk1.8.0_202\bin\javac.exe" (
    set "JAVAC_BIN=C:\Program Files\Java\jdk1.8.0_202\bin\javac.exe"
    set "JAVA_BIN=C:\Program Files\Java\jdk1.8.0_202\bin\java.exe"
)

if not exist "%~dp0backend\bin" mkdir "%~dp0backend\bin"

echo Compiling Java source files...
"%JAVAC_BIN%" -encoding UTF-8 -d "%~dp0backend\bin" "%~dp0backend\src\com\shuttle\model\*.java" "%~dp0backend\src\com\shuttle\util\*.java" "%~dp0backend\src\com\shuttle\repository\*.java" "%~dp0backend\src\com\shuttle\server\*.java"

if %ERRORLEVEL% NEQ 0 (
    echo Compilation failed!
    exit /b %ERRORLEVEL%
)

echo Compilation succeeded. Starting server on http://localhost:8085 ...
"%JAVA_BIN%" -cp "%~dp0backend\bin" com.shuttle.server.ShuttleApiServer 8085
