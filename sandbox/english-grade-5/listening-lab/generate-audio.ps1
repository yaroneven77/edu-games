param(
    [string]$Page = (Join-Path $PSScriptRoot 'index.html'),
    [ValidatePattern('^[a-z][a-z0-9-]*$')]
    [string]$DataId = 'listening-data'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech

$html = [System.IO.File]::ReadAllText($Page)
$pattern = '<script\b[^>]*\bid=["'']' + [regex]::Escape($DataId) + '["''][^>]*>([\s\S]*?)</script>'
$match = [regex]::Match($html, $pattern)
if (-not $match.Success) { throw "The page must contain the $DataId JSON script." }
$content = $match.Groups[1].Value | ConvertFrom-Json
if (-not $content.recordings.Count) { throw 'No recording scripts were found.' }

$voices = @{ a = 'Microsoft David Desktop'; b = 'Microsoft Zira Desktop'; n = 'Microsoft Zira Desktop' }
$ids = [System.Collections.Generic.HashSet[string]]::new()
foreach ($recording in $content.recordings) {
    if ($recording.id -notmatch '^[a-z][a-z0-9-]*$' -or -not $ids.Add($recording.id)) {
        throw "Invalid or duplicate recording ID: $($recording.id)"
    }
    if (-not $recording.lines.Count) { throw "Empty recording: $($recording.id)" }
    foreach ($line in $recording.lines) {
        if (-not $voices.ContainsKey([string]$line.speaker) -or [string]::IsNullOrWhiteSpace($line.text)) {
            throw "Invalid speaker or text in $($recording.id)"
        }
    }
}

$audioDirectory = Join-Path (Split-Path -Parent $Page) 'audio'
[System.IO.Directory]::CreateDirectory($audioDirectory) | Out-Null
$synth = [System.Speech.Synthesis.SpeechSynthesizer]::new()
$format = [System.Speech.AudioFormat.SpeechAudioFormatInfo]::new(
    22050,
    [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen,
    [System.Speech.AudioFormat.AudioChannel]::Mono
)
$manifest = @()
try {
    $installed = @($synth.GetInstalledVoices() | Where-Object Enabled | ForEach-Object { $_.VoiceInfo.Name })
    foreach ($voice in ($voices.Values | Sort-Object -Unique)) {
        if ($voice -notin $installed) { throw "Required offline voice is not installed: $voice" }
    }
    $synth.Rate = -1
    $synth.Volume = 100
    foreach ($recording in $content.recordings) {
        $prompt = [System.Speech.Synthesis.PromptBuilder]::new([System.Globalization.CultureInfo]::GetCultureInfo('en-US'))
        foreach ($line in $recording.lines) {
            $prompt.StartVoice($voices[[string]$line.speaker])
            $prompt.AppendText([string]$line.text)
            $prompt.EndVoice()
            $prompt.AppendBreak([TimeSpan]::FromMilliseconds(300))
        }
        $destination = Join-Path $audioDirectory ($recording.id + '.wav')
        $temporary = $destination + '.tmp'
        try {
            $synth.SetOutputToWaveFile($temporary, $format)
            $synth.Speak($prompt)
            $synth.SetOutputToNull()
            $bytes = [System.IO.File]::ReadAllBytes($temporary)
            if ($bytes.Length -le 1000 -or [System.Text.Encoding]::ASCII.GetString($bytes, 0, 4) -ne 'RIFF') {
                throw "Synthesis did not produce WAV audio for $($recording.id)"
            }
            Move-Item -LiteralPath $temporary -Destination $destination -Force
        }
        finally {
            $synth.SetOutputToNull()
            if (Test-Path -LiteralPath $temporary) { Remove-Item -LiteralPath $temporary }
        }
        $source = @{ lines = $recording.lines; voices = $voices; rate = -1; sampleRate = 22050; pauseMs = 300 } |
            ConvertTo-Json -Depth 10 -Compress
        $sourceBytes = [System.Text.Encoding]::UTF8.GetBytes($source)
        $sourceHash = [Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData($sourceBytes)).ToLowerInvariant()
        $scriptText = ($recording.lines | ForEach-Object { $_.speaker + "`t" + $_.text }) -join "`n"
        $scriptHash = [Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([System.Text.Encoding]::UTF8.GetBytes($scriptText))).ToLowerInvariant()
        $manifest += [ordered]@{
            id = $recording.id
            file = 'audio/' + $recording.id + '.wav'
            bytes = $bytes.Length
            sha256 = (Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash.ToLowerInvariant()
            sourceHash = $sourceHash
            scriptHash = $scriptHash
        }
    }
}
finally {
    $synth.Dispose()
}

$manifestPath = Join-Path $audioDirectory 'manifest.json'
$manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $manifestPath -Encoding utf8
Write-Output "Generated $($manifest.Count) original synthetic recordings in $audioDirectory"
