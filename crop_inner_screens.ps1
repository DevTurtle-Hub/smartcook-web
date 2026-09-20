Add-Type -AssemblyName System.Drawing

$imgPath = "C:\Users\VAN QUY\.gemini\antigravity-ide\brain\ec51177f-0e49-4a23-a601-18f01e0a3ffa\.user_uploaded\media_1789831241441.jpg"
$src = [System.Drawing.Bitmap]::FromFile($imgPath)

# Cắt chính xác nội dung màn hình hiển thị (Bỏ hoàn toàn vỏ viền điện thoại mờ bên ngoài)
# Hàng trên:
# 1. Trang chủ: x=40, y=30, w=146, h=304
# 2. Tủ lạnh: x=286, y=37, w=144, h=300
# 3. Camera Fridge: x=554, y=37, w=148, h=300
# 4. Survey: x=820, y=36, w=148, h=302
# Hàng dưới:
# 5. Siêu thị: x=178, y=362, w=148, h=302
# 6. Recipe Detail: x=395, y=362, w=150, h=302
# 7. AI Vision Scan: x=678, y=360, w=150, h=304

$screenCrops = @(
  @{ name="screen_home.png";          x=40;  y=30;  w=146; h=304 },
  @{ name="screen_fridge.png";        x=286; y=37;  w=144; h=300 },
  @{ name="screen_camera_fridge.png"; x=554; y=37;  w=148; h=300 },
  @{ name="screen_survey.png";        x=820; y=36;  w=148; h=302 },
  @{ name="screen_market.png";        x=178; y=362; w=148; h=302 },
  @{ name="screen_recipe_detail.png"; x=395; y=362; w=150; h=302 },
  @{ name="screen_ai_scan.png";       x=678; y=360; w=150; h=304 }
)

$outDir = "d:\smartcook-web\public\app-screens"

foreach ($item in $screenCrops) {
    $rect = New-Object System.Drawing.Rectangle($item.x, $item.y, $item.w, $item.h)
    $target = New-Object System.Drawing.Bitmap($item.w, $item.h)
    $g = [System.Drawing.Graphics]::FromImage($target)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $item.w, $item.h)
    $g.DrawImage($src, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    
    $savePath = Join-Path $outDir $item.name
    $target.Save($savePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $target.Dispose()
    Write-Host "Re-exported crisp inner screen: $($item.name)"
}

$src.Dispose()
Write-Host "Finished cropping crisp screens."
