<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>医王ヶ丘職場安全点検</title>
  <style>
    body {
      font-family: sans-serif;
      margin: 20px;
    }
    .inspection-item {
      border: 1px solid #ccc;
      padding: 10px;
      margin-bottom: 20px;
    }
    .photo-preview img {
      max-width: 100px;
      margin: 5px;
    }
    .photo-wrapper {
      display: inline-block;
      position: relative;
      margin-right: 5px;
    }
    .delete-photo {
      position: absolute;
      top: 0;
      right: 0;
      background: red;
      color: white;
      border: none;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <h1>医王ヶ丘職場安全点検表</h1>

  <!-- 点検者のチェック欄 -->
  <p>
    点検者:
    <label><input type="checkbox" name="inspector" value="山田"> 山田</label>
    <label><input type="checkbox" name="inspector" value="佐藤"> 佐藤</label>
    <label><input type="checkbox" name="inspector" value="鈴木"> 鈴木</label>
  </p>

  <!-- PDFに含めたい内容をまとめたラッパー -->
  <div id="pdf-content">
    <div id="inspectionItems"></div>
  </div>

  <!-- PDF出力ボタン -->
  <button id="generatePdf">PDF出力</button>

  <!-- ライブラリ読み込み -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

  <!-- メインスクリプト -->
  <script>
    docu
