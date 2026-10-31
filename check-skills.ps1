$ErrorActionPreference = 'Stop'
$names = @(
    'mini-prd',
    'write-tech-spec',
    'create-issues',
    'spec-contract',
    'guideline-guard',
    'deterministic-verify',
    'evidence-receipt',
    'project-handoff',
    'implement-task',
    'verify',
    'git-workflow',
    'sentana-ui-patterns'
)
foreach ($name in $names) {
    $path = Join-Path $PSScriptRoot "skills/$name/SKILL.md"
    $text = Get-Content -LiteralPath $path -Raw -Encoding UTF8
    if ($text -notmatch "(?s)^---\r?\nname: $name\r?\ndescription: [^\r\n]+\r?\n(?:metadata:\r?\n  opencode/autoinvoke: false\r?\n)?---") {
        throw "Invalid metadata: $name"
    }
    if ($text -notmatch '## Alur' -or $text -notmatch '## (Format )?(Keluaran|Isi PRD|Isi spec|Isi setiap task)') {
        throw "Missing workflow or output: $name"
    }
    $globalPath = Join-Path $HOME ".config/opencode/skills/$name/SKILL.md"
    if (Test-Path -LiteralPath $globalPath) {
        $installed = Get-Content -LiteralPath $globalPath -Raw -Encoding UTF8
        if ($text.TrimEnd() -cne $installed.TrimEnd()) { throw "Global copy differs: $name" }
    } else {
        Write-Output "NOT RUN global comparison: $name is not installed"
    }
    Write-Output "PASS structure: $name"
}
$readme = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'README.md') -Raw -Encoding UTF8
foreach ($link in [regex]::Matches($readme, '\]\((skills/[^)]+)\)')) {
    if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot $link.Groups[1].Value))) {
        throw "Broken README link: $($link.Groups[1].Value)"
    }
}
Write-Output 'PASS README links'
