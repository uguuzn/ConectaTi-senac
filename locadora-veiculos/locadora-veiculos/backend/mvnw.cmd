@echo off
setlocal

rem Maven Wrapper simplificado — baixa o Apache Maven dentro da pasta do projeto
rem (em backend\.mvn) na primeira execucao, sem precisar instalar nada nem ter
rem permissao de administrador. Nas proximas vezes, reaproveita o que ja baixou.
rem
rem Uso: mvnw.cmd spring-boot:run   (em vez de "mvn spring-boot:run")

set MAVEN_VERSION=3.9.6
set BASE_DIR=%~dp0
set MAVEN_HOME=%BASE_DIR%.mvn\maven-%MAVEN_VERSION%
set MAVEN_ZIP=%BASE_DIR%.mvn\maven.zip
set MAVEN_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip

if exist "%MAVEN_HOME%\bin\mvn.cmd" goto :run

echo Primeira execucao: baixando o Apache Maven %MAVEN_VERSION% (so acontece uma vez)...
if not exist "%BASE_DIR%.mvn" mkdir "%BASE_DIR%.mvn"
if exist "%MAVEN_ZIP%" del "%MAVEN_ZIP%"

rem Tenta primeiro com curl (built-in no Windows 10 1803+), que costuma lidar
rem melhor com TLS do que o PowerShell em máquinas mais antigas.
where curl >nul 2>nul
if %errorlevel%==0 (
  curl -fsSL "%MAVEN_URL%" -o "%MAVEN_ZIP%"
)

rem Se o curl nao existir ou nao tiver baixado, tenta com PowerShell forcando TLS 1.2
rem (em Windows desatualizados, o PowerShell usa TLS 1.0 por padrao e a conexao falha
rem  silenciosamente contra servidores que exigem TLS 1.2+, como o repo.maven.apache.org).
if not exist "%MAVEN_ZIP%" (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%MAVEN_ZIP%'"
)

if not exist "%MAVEN_ZIP%" (
  echo.
  echo ERRO: nao foi possivel baixar o Maven.
  echo Causas mais comuns:
  echo   - Firewall/proxy da escola bloqueando repo.maven.apache.org
  echo   - Antivirus bloqueando o download
  echo   - Rede sem internet no momento
  echo Peca para o suporte de TI verificar o acesso a repo.maven.apache.org,
  echo ou tente rodar em outra rede ^(ex: compartilhar internet do celular^).
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%BASE_DIR%.mvn' -Force"
if not exist "%BASE_DIR%.mvn\apache-maven-%MAVEN_VERSION%\bin\mvn.cmd" (
  echo.
  echo ERRO: o download foi feito mas a extracao falhou ou ficou incompleta.
  echo Apague a pasta "backend\.mvn" e tente rodar o comando novamente.
  del "%MAVEN_ZIP%" 2>nul
  exit /b 1
)
ren "%BASE_DIR%.mvn\apache-maven-%MAVEN_VERSION%" "maven-%MAVEN_VERSION%"
del "%MAVEN_ZIP%"
echo Maven pronto.

:run
call "%MAVEN_HOME%\bin\mvn.cmd" %*
