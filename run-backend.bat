@echo off
setlocal
echo [Campus Shuttle Transit] Compiling and starting Java Backend...

set JAVAC_BIN=javac
set JAVA_BIN=java

if exist "C:\Program Files\Java\jdk1.8.0_202\bin\javac.exe" (
    set "JAVAC_BIN=C:\Program Files\Java\jdk1.8.0_202\bin\javac.exe"
    set "JAVA_BIN=C:\Program Files\Java\jdk1.8.0_202\bin\java.exe"
)

pushd "%~dp0backend"
if not exist "bin" mkdir "bin"

echo Compiling Java source files...
"%JAVAC_BIN%" -encoding UTF-8 -d bin src\com\shuttle\model\*.java src\com\shuttle\util\*.java src\com\shuttle\repository\*.java src\com\shuttle\server\*.java

if %ERRORLEVEL% NEQ 0 (
    echo Compilation failed!
    popd
    exit /b %ERRORLEVEL%
)

echo Compilation succeeded. Starting server on http://localhost:8085 ...
"%JAVA_BIN%" -cp bin com.shuttle.server.ShuttleApiServer 8085
popd
