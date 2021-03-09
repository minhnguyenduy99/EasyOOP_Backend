@echo off
for /f "tokens=*" %%s in (.development.env) do (
    for /f "tokens=1,2 delims==" %%a in ("%%s%") do (
        if %%a == APP_PORT (
            set PORT=%%b
            goto ENDFOR
        )
    )
)
:ENDFOR

ngrok http %PORT%