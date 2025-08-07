# PowerShell script to download placeholder images from existing URLs
$basePath = "$PSScriptRoot/../public/images/placeholders"

# List of URLs found in codebase
$urls = @(
    "https://readdy.ai/api/search-image?query=Professional%20woman%20portrait&width=128&height=128&seq=account-avatar",
    "https://readdy.ai/api/search-image?query=Elegant%20silk%20blouse&width=400&height=400&seq=blouse1",
    "https://readdy.ai/api/search-image?query=High-waisted%20denim%20jeans&width=400&height=400&seq=jeans2",
    "https://readdy.ai/api/search-image?query=Classic%20ballet%20flats&width=400&height=400&seq=flats1",
    "https://readdy.ai/api/search-image?query=Luxurious%20cashmere%20cardigan&width=400&height=400&seq=cardigan1",
    "https://readdy.ai/api/search-image?query=Stylish%20ankle%20boots&width=400&height=400&seq=boots2"
)

foreach ($url in $urls) {
    $fileName = [System.Web.HttpUtility]::ParseQueryString([Uri]$url).Get("seq") + ".png"
    $output = "$basePath/$fileName"
    
    if (-not (Test-Path $output)) {
        Write-Host "Downloading $fileName..."
        Invoke-WebRequest -Uri $url -OutFile $output
    }
    else {
        Write-Host "Skipping existing file: $fileName"
    }
}

Write-Host "\nAll placeholder images downloaded to: $basePath"