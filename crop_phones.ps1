Add-Type -AssemblyName System.Drawing

$imgPath = "C:\Users\VAN QUY\.gemini\antigravity-ide\brain\ec51177f-0e49-4a23-a601-18f01e0a3ffa\.user_uploaded\media_1789831241441.jpg"
$src = [System.Drawing.Bitmap]::FromFile($imgPath)

$crops = @(
  @{ name="phone_home.png"; x=28; y=17; w=168; h=330 },
  @{ name="phone_fridge.png"; x=274; y=24; w=164; h=326 },
  @{ name="phone_camera_fridge.png"; x=544; y=25; w=168; h=326 },
  @{ name="phone_survey.png"; x=810; y=23; w=168; h=328 },
  @{ name="phone_market.png"; x=165; y=350; w=172; h=328 },
  @{ name="phone_recipe_detail.png"; x=382; y=350; w=174; h=328 },
  @{ name="phone_ai_scan.png"; x=666; y=348; w=174; h=330 }
)

$outDir = "d:\smartcook-web\public\app-screens"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

foreach ($item in $crops) {
    $rect = New-Object System.Drawing.Rectangle($item.x, $item.y, $item.w, $item.h)
    $target = New-Object System.Drawing.Bitmap($item.w, $item.h)
    $g = [System.Drawing.Graphics]::FromImage($target)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $item.w, $item.h)
    $g.DrawImage($src, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    
    $savePath = Join-Path $outDir $item.name
    $target.Save($savePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $target.Dispose()
    Write-Host "Exported: $($item.name)"
}

$src.Dispose()
Write-Host "Completed extracting 7 phone screens."
