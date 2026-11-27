param(
  [Parameter(Mandatory = $true)][string]$LocalFile,
  [Parameter(Mandatory = $true)][string]$RemoteName
)

$ErrorActionPreference = 'Stop'

function Load-EnvLocal {
  $envPath = Join-Path (Get-Location) '.env.local'
  if (-not (Test-Path $envPath)) { return }
  foreach ($line in Get-Content $envPath) {
    $trimmed = $line.Trim()
    if (-not $trimmed -or $trimmed.StartsWith('#')) { continue }
    $idx = $trimmed.IndexOf('=')
    if ($idx -le 0) { continue }
    $key = $trimmed.Substring(0, $idx).Trim()
    $val = $trimmed.Substring($idx + 1).Trim().Trim('"').Trim("'")
    if ($val -and -not [Environment]::GetEnvironmentVariable($key)) {
      [Environment]::SetEnvironmentVariable($key, $val, 'Process')
    }
  }
}

Load-EnvLocal

$supabaseUrl = ($env:NEXT_PUBLIC_SUPABASE_URL).TrimEnd('/')
$serviceKey = $env:SUPABASE_SERVICE_ROLE_KEY
if (-not $supabaseUrl -or -not $serviceKey) {
  throw 'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment or .env.local'
}

if (-not (Test-Path $LocalFile)) {
  throw "File not found: $LocalFile"
}

$bucket = 'blog-covers'
$headers = @{
  apikey        = $serviceKey
  Authorization = "Bearer $serviceKey"
}

# Ensure public bucket exists
try {
  $bucketBody = @{ id = $bucket; name = $bucket; public = $true } | ConvertTo-Json -Compress
  Invoke-RestMethod -Uri "$supabaseUrl/storage/v1/bucket" -Method Post -Headers ($headers + @{ 'Content-Type' = 'application/json' }) -Body $bucketBody | Out-Null
} catch {
  $status = $_.Exception.Response.StatusCode.value__
  if ($status -ne 409) {
    $msg = $_.ErrorDetails.Message
    if (-not ($msg -and $msg.ToLower().Contains('already exists'))) {
      throw
    }
  }
}

$ext = [System.IO.Path]::GetExtension($LocalFile).ToLower()
$contentType = switch ($ext) {
  '.webp' { 'image/webp' }
  '.jpg'  { 'image/jpeg' }
  '.jpeg' { 'image/jpeg' }
  default { 'image/png' }
}

$bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $LocalFile))
$uploadUrl = "$supabaseUrl/storage/v1/object/$bucket/$([Uri]::EscapeDataString($RemoteName))"
$uploadHeaders = $headers + @{
  'Content-Type' = $contentType
  'x-upsert'     = 'true'
}

Invoke-RestMethod -Uri $uploadUrl -Method Post -Headers $uploadHeaders -Body $bytes | Out-Null

Write-Output "$supabaseUrl/storage/v1/object/public/$bucket/$RemoteName"
