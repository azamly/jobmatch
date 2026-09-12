$r = Invoke-WebRequest -Uri 'http://127.0.0.1:8000' -Method GET -UseBasicParsing -ErrorAction SilentlyContinue
if ($r) { $r.StatusCode } else { "FAILED" }