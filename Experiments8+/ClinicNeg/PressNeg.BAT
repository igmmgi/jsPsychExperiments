CD /D %C:\Users\Testung\Desktop\ClinicNegMixed\jsPsychExperiments%
start live-server --browser=firefox --open=Experiments8+\ClinicNeg\PressNeg\index.html? &
pause
taskkill /F /IM node.exe
move C:\Users\Testung\Downloads\*.csv C:\Users\Testung\Desktop\ClinicNegMixed\PressNeg\data
taskkill /F /IM cmd.exe
