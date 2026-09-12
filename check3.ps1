$r = Invoke-WebRequest -Uri 'http://localhost:5173' -Method GET -UseBasicParsing -ErrorAction SilentlyContinue
if ($r) { $r.StatusCode } else { "FAILED" }