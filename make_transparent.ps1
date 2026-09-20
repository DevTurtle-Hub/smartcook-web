Add-Type -AssemblyName System.Drawing

$srcPath = "d:\smartcook-web\public\realistic_chef_cooking.jpg"
$outPath = "d:\smartcook-web\public\chef_transparent.png"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $src.Width
$height = $src.Height

$target = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Background color sample
$corner = $src.GetPixel(10, 10)
$refR = [int]$corner.R
$refG = [int]$corner.G
$refB = [int]$corner.B
Write-Host "Sampled: R=$refR G=$refG B=$refB"

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $p = $src.GetPixel($x, $y)
        $diff = [Math]::Sqrt([Math]::Pow($p.R - $refR, 2) + [Math]::Pow($p.G - $refG, 2) + [Math]::Pow($p.B - $refB, 2))
        
        if ($diff -lt 14) {
            $target.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($diff -lt 34) {
            $alpha = [int](($diff - 14) / 20.0 * 255)
            $target.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
        } else {
            $target.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $p.R, $p.G, $p.B))
        }
    }
}

$target.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$src.Dispose()
$target.Dispose()
Write-Host "Successfully generated transparent PNG: $outPath"
