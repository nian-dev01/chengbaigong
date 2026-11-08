# 批量替换硬编码朱砂红 → 柔紫系，UTF-8 安全写入
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$files = Get-ChildItem -Recurse -File -Include *.wxss,*.wxml,*.js,*.json,*.css

$count = 0
foreach ($f in $files) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  $new = $c.Replace('#c8161d', '#7B6EA5').Replace('#C8161D', '#7B6EA5').Replace('#e03239', '#9B8EC5').Replace('#E03239', '#9B8EC5')
  if ($new -ne $c) {
    [System.IO.File]::WriteAllText($f.FullName, $new, $utf8NoBom)
    Write-Output "updated: $($f.Name)"
    $count++
  }
}
Write-Output "`nTotal: $count files"
