try { 
    $r = Invoke-WebRequest -Uri 'http://127.0.0.1:8000' -Method GET -UseBasicParsing
    Write-Host $r.StatusCode
} catch { 
    Write-Host $_.Exception.Response.StatusCode.value__
}